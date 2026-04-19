"use client"

import { useState } from "react"
import FadeIn from "@/components/fade-in"

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <FadeIn key={i} delay={i * 100}>
            <div
              className={`border rounded-xl overflow-hidden transition-all bg-white dark:bg-gray-800 ${
                isOpen ? "border-[#037EBD] shadow-sm" : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left group"
              >
                <p className={`text-sm font-medium transition-colors ${
                  isOpen ? "text-[#037EBD]" : "text-gray-700 dark:text-gray-200 group-hover:text-[#037EBD]"
                }`}>
                  {item.question}
                </p>
                <span className={`text-xl ml-4 transition-all ${
                  isOpen ? "text-[#037EBD] rotate-90" : "text-gray-400 dark:text-gray-500 group-hover:text-[#037EBD]"
                }`}>
                  ›
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </FadeIn>
        )
      })}
    </div>
  )
}
