"use client"

import { useState, useEffect } from "react"

interface RotatingTextProps {
  texts: string[]
  interval?: number
  className?: string
}

export default function RotatingText({ texts, interval = 3000, className = "" }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length)
        setVisible(true)
      }, 500)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <p className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${className}`}>
      {texts[index]}
    </p>
  )
}
