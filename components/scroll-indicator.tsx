"use client"

import { useState, useEffect } from "react"

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 100)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })
  }

  return (
    <button
      onClick={scrollDown}
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll down"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#037EBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </button>
  )
}
