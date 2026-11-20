import type { Profile } from "@/discover/service"
export function Card({ p, stamp }: { p: Profile; stamp: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white select-none">
      <div role="img" aria-label={`Photo placeholder for ${p.name}`} className="relative flex min-h-0 flex-1 items-center justify-center bg-raised bg-cover bg-center text-9xl font-extrabold" style={{ backgroundImage: `url(${p.photo})` }}>
        {p.name[0]}
        {stamp && <span className={`absolute top-5 rounded-lg border-2 border-ink px-3 text-2xl font-extrabold ${stamp === "right" ? "left-5 -rotate-12 bg-primary" : "right-5 rotate-12 bg-white"}`}>{stamp === "right" ? "LIKE" : "PASS"}</span>}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h2 className="text-2xl font-extrabold">{p.name} <span className="font-normal">{p.age}</span></h2>
        <p className="text-sm text-muted">{p.place}</p>
        <p>{p.bio}</p>
        <p className="text-sm text-muted">{p.interests.join(" · ")}</p>
      </div>
    </article>
  )
}
