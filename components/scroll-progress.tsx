"use client"

import { useState, useEffect } from "react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60]">
      <div
        className="h-full bg-gradient-to-r from-[#037EBD] to-[#025f8f] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
