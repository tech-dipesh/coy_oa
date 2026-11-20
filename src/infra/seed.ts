import { sql } from "@/infra/db"
import profiles from "@/discover/profiles.json"
const ddl = [
  "drop table if exists matches, swipes, likes_me, profiles",
  "create table profiles (id int primary key, name text not null, age int not null check (age >= 18), photo text not null, bio text not null, place text not null, interests text[] not null)",
  "create table likes_me (profile_id int primary key references profiles (id), intent text not null check (intent in ('explore', 'dating', 'longterm')), note text check (char_length(note) <= 120))",
  "create table swipes (profile_id int primary key references profiles (id), action text not null check (action in ('like', 'pass')), created_at timestamptz not null default now())",
  "create table matches (profile_id int primary key references profiles (id), my_intent text not null check (my_intent in ('explore', 'dating', 'longterm')), my_note text check (char_length(my_note) <= 120), their_intent text not null, their_note text, created_at timestamptz not null default now())",
]
async function main() {
  const likes = profiles.flatMap(({ id, likesMe }) => (likesMe ? [{ id, ...likesMe }] : []))
  await sql.transaction([
    ...ddl.map((text) => sql.query(text)),
    sql.query("insert into profiles select * from json_populate_recordset(null::profiles, $1::json)", [JSON.stringify(profiles)]),
    sql.query("insert into likes_me select id, intent, note from json_to_recordset($1::json) as x(id int, intent text, note text)", [JSON.stringify(likes)]),
  ])
  console.log(`seeded ${profiles.length} profiles, ${likes.length} already like you`)
}
main()
