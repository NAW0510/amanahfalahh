"use client"

import { useRef, useEffect, useState, ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  direction?: "up" | "left" | "right"
  delay?: number
}

export default function FadeIn({ children, className = "", direction = "up", delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const directionClasses = {
    up: isVisible ? "translate-y-0" : "translate-y-10",
    left: isVisible ? "translate-x-0" : "-translate-x-10",
    right: isVisible ? "translate-x-0" : "translate-x-10",
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100" : "opacity-0"} ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  )
}
