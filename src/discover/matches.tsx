"use client"
import type { Match } from "@/discover/service"
import { useFetchData } from "@/web/api"
import { labels } from "@/discover/labels"
export function Matches() {
  const { data, error, loading, reload } = useFetchData<Match[]>("/matches")
  if (loading) return <p className="px-5 text-muted">Loading matches</p>
  if (error) return <div className="flex flex-col items-start gap-3 px-5"><p>{error}</p><button onClick={reload} className="h-10 rounded-full border-2 border-ink px-5 font-semibold">Try again</button></div>
  if (!data?.length) return <div className="px-5"><h2 className="text-2xl font-extrabold">No matches yet</h2><p className="text-muted">Matches show up here when you both like each other.</p></div>
  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4">
      {data.map((m) => (
        <li key={m.id} className="flex flex-col gap-2 rounded-3xl border border-line p-4">
          <div className="flex items-center gap-3">
            <div role="img" aria-label={`Photo placeholder for ${m.name}`} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-raised bg-cover bg-center text-xl font-extrabold" style={{ backgroundImage: `url(${m.photo})` }}>{m.name[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">{m.name}, {m.age}</p>
              <p className="truncate text-sm text-muted">{m.place}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary px-3 text-sm font-semibold">{labels[m.theirIntent]}</span>
          </div>
          {m.theirNote && <p className="rounded-2xl bg-raised px-3 py-2 text-sm"><span className="font-extrabold">{m.name} also sent you a note: </span>{m.theirNote}</p>}
        </li>
      ))}
    </ul>
  )
}
