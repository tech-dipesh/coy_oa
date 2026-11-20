"use client"
import { useEffect, useState } from "react"
import type { SubmitEvent } from "react"
import type { Profile } from "@/discover/service"
import { labels } from "@/discover/labels"
export function Sheet({ p, error, onSend, onCancel }: { p: Profile; error: string; onSend: (intent: string, note: string) => Promise<void>; onCancel: () => void }) {
  const [intent, setIntent] = useState("dating")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    await onSend(intent, note.trim())
    setBusy(false)
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onCancel])
  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/40">
      <form role="dialog" aria-modal="true" aria-labelledby="sheet-title" onSubmit={submit} className="flex w-full max-w-md flex-col gap-4 rounded-t-3xl bg-white p-5">
        <h2 id="sheet-title" className="text-2xl font-extrabold">Like {p.name}</h2>
        <fieldset className="flex flex-col">
          <legend className="mb-1 text-sm font-semibold text-muted">What are you here for?</legend>
          {Object.entries(labels).map(([key, text]) => (
            <label key={key} className="flex min-h-11 items-center gap-3">
              <input type="radio" name="intent" value={key} checked={intent === key} onChange={() => setIntent(key)} className="size-5 accent-primary" />
              {text}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm font-semibold text-muted">
            <label htmlFor="note">Sealed note (optional)</label>
            <span>{note.length}/120</span>
          </div>
          <textarea id="note" rows={2} maxLength={120} value={note} onChange={(e) => setNote(e.target.value)} placeholder="One line. Only opens if you both match." className="resize-none rounded-2xl border-2 border-ink p-3" />
          <p className="text-sm text-muted">{p.name} sees this only if they like you back.</p>
        </div>
        {error && <p role="alert" className="text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="h-12 rounded-full border-2 border-ink px-6 font-semibold">Cancel</button>
          <button type="submit" disabled={busy} className="h-12 flex-1 rounded-full bg-primary font-extrabold disabled:opacity-60">{busy ? "Sending" : "Send like"}</button>
        </div>
      </form>
    </div>
  )
}
