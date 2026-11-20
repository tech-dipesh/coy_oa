"use client"
import { useState } from "react"
import { Swipe } from "@/discover/swipe"
import { Matches } from "@/discover/matches"
const views = ["Swipe", "Matches"]
export function Discover() {
  const [view, setView] = useState("Swipe")
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-3xl font-extrabold">coy</span>
        <div className="flex gap-1">
          {views.map((name) => (
            <button key={name} onClick={() => setView(name)} aria-pressed={view === name} className={`h-10 rounded-full px-4 text-sm font-semibold ${view === name ? "bg-primary" : ""}`}>{name}</button>
          ))}
        </div>
      </header>
      {view === "Swipe" ? <Swipe onMatches={() => setView("Matches")} /> : <Matches />}
    </div>
  )
}
