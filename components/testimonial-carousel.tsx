"use client"

import { useState, useEffect, useCallback } from "react"

interface Testimonial {
  name: string
  role: string
  text: string
}

interface TestimonialCarouselProps {
  items: Testimonial[]
  interval?: number
}

export default function TestimonialCarousel({ items, interval = 5000 }: TestimonialCarouselProps) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("right")

  const next = useCallback(() => {
    setDirection("right")
    setActive((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setDirection("left")
    setActive((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, interval])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="relative min-h-[200px] flex items-center justify-center">
        {items.map((item, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
              i === active
                ? "opacity-100 translate-x-0"
                : i < active || (active === 0 && i === items.length - 1 && direction === "left")
                ? "opacity-0 -translate-x-10"
                : "opacity-0 translate-x-10"
            }`}
          >
            <svg className="w-8 h-8 text-[#037EBD] mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 italic">
              &ldquo;{item.text}&rdquo;
            </p>
            <p className="font-semibold text-[#0A3D5C] dark:text-white">{item.name}</p>
            <p className="text-sm text-[#037EBD]">{item.role}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
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
      <div className="flex justify-center gap-3 mt-4">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg">
          ‹
        </button>
        <button onClick={next} className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg">
          ›
        </button>
      </div>
    </div>
  )
}
