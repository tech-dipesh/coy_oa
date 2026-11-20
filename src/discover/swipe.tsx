"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import TinderCard from "react-tinder-card"
import type { ComponentRef } from "react"
import type { Match, Profile } from "@/discover/service"
import { api, useFetchData } from "@/web/api"
import { Card } from "@/discover/card"
import { Sheet } from "@/discover/sheet"
import { MatchScreen } from "@/discover/match-screen"
const blocked = ["up", "down"]
export function Swipe({ onMatches }: { onMatches: () => void }) {
  const { data, setData, error, loading, reload } = useFetchData<Profile[]>("/feed")
  const [pending, setPending] = useState<Profile>()
  const [match, setMatch] = useState<Match>()
  const [stamp, setStamp] = useState("")
  const [fail, setFail] = useState("")
  const card = useRef<ComponentRef<typeof TinderCard>>(null)
  const top = data?.[0]
  const topRef = useRef<Profile>(undefined)
  const drop = useCallback((id: number) => setData((list) => list?.filter((p) => p.id !== id)), [setData])
  const onSwipe = useCallback(async (dir: string) => {
    setStamp("")
    const p = topRef.current
    if (!p) return
    if (dir === "right") return setPending(p)
    try { await api.post("/swipe", { profileId: p.id, action: "pass" }) } catch { setFail("could not save that swipe") }
  }, [])
  const onLeft = useCallback((dir: string) => { if (dir === "left" && topRef.current) drop(topRef.current.id) }, [drop])
  const onUnfulfilled = useCallback(() => setStamp(""), [])
  useEffect(() => { topRef.current = top }, [top])
  const like = async (intent: string, note: string) => {
    if (!pending) return
    try {
      const { data: res } = await api.post<{ matched: boolean; match?: Match }>("/swipe", { profileId: pending.id, action: "like", intent, note })
      drop(pending.id)
      setPending(undefined)
      setMatch(res.match)
    } catch { setFail("could not send your like, try again") }
  }
  const cancel = () => { setPending(undefined); setFail(""); card.current?.restoreCard() }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pending || match || !top) return
      if (e.key === "ArrowLeft") card.current?.swipe("left")
      if (e.key === "ArrowRight") card.current?.swipe("right")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pending, match, top])
  if (loading) return <p className="px-5 text-muted">Loading profiles</p>
  if (error) return <div className="flex flex-col items-start gap-3 px-5"><p>{error}</p><button onClick={reload} className="h-10 rounded-full border-2 border-ink px-5 font-semibold">Try again</button></div>
  if (!top) return <div className="px-5"><h2 className="text-2xl font-extrabold">No more profiles</h2><p className="text-muted">You have swiped on everyone for now.</p></div>
  return (
    <>
      <div className="relative mx-5 min-h-0 flex-1">
        <TinderCard key={top.id} ref={card} className="absolute inset-0 touch-none" preventSwipe={blocked} swipeRequirementType="position" swipeThreshold={100} onSwipeRequirementFulfilled={setStamp} onSwipeRequirementUnfulfilled={onUnfulfilled} onSwipe={onSwipe} onCardLeftScreen={onLeft}>
          <Card p={top} stamp={stamp} />
        </TinderCard>
      </div>
      <div className="px-5 py-4 text-center">
        {fail && <p role="alert" className="mb-2 text-sm">{fail}</p>}
        <div className="hidden justify-center gap-4 md:flex">
          <button onClick={() => card.current?.swipe("left")} className="h-12 rounded-full border-2 border-ink px-8 font-semibold">Pass</button>
          <button onClick={() => card.current?.swipe("right")} className="h-12 rounded-full bg-primary px-8 font-extrabold">Like</button>
        </div>
        <p className="text-sm text-muted md:hidden">Drag the card left to pass, right to like</p>
        <p className="hidden text-sm text-muted md:mt-3 md:block">Left and right arrow keys also work</p>
      </div>
      {pending && <Sheet p={pending} error={fail} onSend={like} onCancel={cancel} />}
      {match && <MatchScreen m={match} onClose={() => setMatch(undefined)} onMatches={onMatches} />}
    </>
  )
}
