import { query } from "@/infra/db"
import { HttpError } from "@/infra/catch"
import type { Swipe } from "@/discover/schema"
export interface Profile { id: number; name: string; age: number; photo: string; bio: string; place: string; interests: string[] }
export interface Match extends Profile { myIntent: string; myNote: string | null; theirIntent: string; theirNote: string | null }
const cols = "p.id, p.name, p.age, p.photo, p.bio, p.place, p.interests"
const matchCols = `${cols}, m.my_intent as "myIntent", m.my_note as "myNote", m.their_intent as "theirIntent", m.their_note as "theirNote"`
const swipeSql = `
with target as (select id from profiles where id = $1),
saved as (
  insert into swipes (profile_id, action) select id, $2::text from target
  on conflict (profile_id) do nothing returning profile_id
),
m as (
  insert into matches (profile_id, my_intent, my_note, their_intent, their_note)
  select s.profile_id, $3::text, $4::text, l.intent, l.note from saved s join likes_me l on l.profile_id = s.profile_id
  where $2::text = 'like' returning *
)
select
  (select count(*) from target)::int as found,
  (select count(*) from saved)::int as saved,
  (select row_to_json(x) from (select ${matchCols} from m join profiles p on p.id = m.profile_id) x) as "match"`
export const getFeed = () => query<Profile>(`select ${cols} from profiles p where not exists (select 1 from swipes s where s.profile_id = p.id) order by p.id`)
export const getMatches = () => query<Match>(`select ${matchCols} from matches m join profiles p on p.id = m.profile_id order by m.created_at desc`)
export async function saveSwipe(swipe: Swipe) {
  const liked = swipe.action === "like"
  const [outcome] = await query<{ found: number; saved: number; match: Match | null }>(swipeSql, [swipe.profileId, swipe.action, liked ? swipe.intent : null, liked ? swipe.note || null : null])
  if (!outcome.found) throw new HttpError(404, "profile not found")
  if (!outcome.saved) throw new HttpError(409, "profile already swiped")
  return outcome.match ? { matched: true, match: outcome.match } : { matched: false }
}
