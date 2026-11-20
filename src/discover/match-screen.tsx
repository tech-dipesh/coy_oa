import type { Match } from "@/discover/service"
import { labels } from "@/discover/labels"
export function MatchScreen({ m, onClose, onMatches }: { m: Match; onClose: () => void; onMatches: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="match-title" className="fixed inset-0 z-20 bg-primary">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4 p-5 pt-16">
        <h2 id="match-title" className="text-6xl leading-none font-extrabold">It&apos;s a match!</h2>
        <p className="text-lg">You and {m.name} liked each other.</p>
        {m.theirNote && <div className="rounded-3xl bg-white p-4"><p className="text-sm font-extrabold">{m.name} also sent you a note</p><p className="text-xl font-semibold">{m.theirNote}</p></div>}
        {m.myNote && <p className="text-sm">Your note: {m.myNote}</p>}
        <p className="text-sm">{m.name}: {labels[m.theirIntent]}. You: {labels[m.myIntent]}.</p>
        <div className="mt-auto flex flex-col gap-3">
          <button onClick={() => { onClose(); onMatches() }} className="h-12 rounded-full bg-ink font-extrabold text-white">View matches</button>
          <button onClick={onClose} className="h-12 rounded-full border-2 border-ink font-semibold">Keep swiping</button>
        </div>
      </div>
    </div>
  )
}
