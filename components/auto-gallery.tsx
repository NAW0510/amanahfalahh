"use client"

import { useState, useEffect, useCallback } from "react"

interface GalleryItem {
  label: string
  image?: string
}

interface AutoGalleryProps {
  items: GalleryItem[]
  interval?: number
}

export default function AutoGallery({ items, interval = 4000 }: AutoGalleryProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [paused, interval, next])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex gap-5 justify-center items-center">
        {items.map((item, i) => {
          const isActive = i === active
          return (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-500 flex-1 ${
                isActive
                  ? "ring-2 ring-[#037EBD] shadow-lg scale-105 z-10"
                  : "opacity-70 scale-95"
              }`}
            >
              <div
                className="bg-[#0A3D5C] h-56 flex items-end p-4 bg-cover bg-center"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                <span className="text-white text-sm font-medium">{item.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all ${
              i === active ? "w-5 h-2 bg-[#037EBD]" : "w-2 h-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg"
        >
          ›
        </button>
      </div>
    </div>
  )
}
