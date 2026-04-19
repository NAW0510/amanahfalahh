"use client"

import { useState, useEffect } from "react"

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500)
    const hide = setTimeout(() => setVisible(false), 2000)
    return () => { clearTimeout(timer); clearTimeout(hide) }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white dark:bg-[#0A3D5C] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#037EBD] to-[#025f8f] flex items-center justify-center animate-pulse shadow-xl">
        <span className="text-white text-2xl font-bold">AF</span>
      </div>
      <p className="mt-4 text-[#037EBD] dark:text-blue-200 text-sm font-medium tracking-wide animate-pulse">
        AmanahFalah
      </p>
    </div>
  )
}
