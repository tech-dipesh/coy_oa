"use client"
import { useState } from "react"
import { Discover } from "@/discover/discover"
const tabs = ["Home", "Discover"]
export function Tabs() {
  const [tab, setTab] = useState("Discover")
  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {tab === "Discover" ? <Discover /> : <main className="flex-1" />}
      <nav aria-label="Main" className="flex border-t border-line">
        {tabs.map((name) => (
          <button key={name} onClick={() => setTab(name)} aria-current={tab === name ? "page" : undefined} className={`h-14 flex-1 text-sm ${tab === name ? "border-t-2 border-primary font-extrabold" : "text-muted"}`}>{name}</button>
        ))}
      </nav>
    </div>
  )
}
