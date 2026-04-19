"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"

const navItems = [
  { label: "Beranda", href: "beranda" },
  { label: "Tentang Kami", href: "tentang" },
  { label: "Visi & Misi", href: "visi" },
  { label: "Tim", href: "tim" },
  { label: "FAQ", href: "faq" },
]

export default function Navbar() {
  const [active, setActive] = useState("beranda")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  // Track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    navItems.forEach(({ href }) => {
      const el = document.getElementById(href)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(href)
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Track scroll for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const scrollTo = useCallback((href: string) => {
    const el = document.getElementById(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }, [])

  return (
    <header
      className={`w-full px-6 md:px-10 py-4 flex items-center justify-between fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 transition-all ${
        scrolled ? "shadow-md dark:shadow-gray-800" : "shadow-sm"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#037EBD] flex items-center justify-center">
          <span className="text-white text-xs font-bold">AF</span>
        </div>
        <span className="text-[#037EBD] font-bold text-lg">AmanahFalah</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300 font-medium">
        {navItems.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => scrollTo(href)}
            className={`pb-0.5 transition-colors ${
              active === href
                ? "text-[#037EBD] border-b-2 border-[#037EBD]"
                : "hover:text-[#037EBD]"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Desktop: dark mode toggle + login */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#037EBD] hover:text-[#037EBD] dark:hover:text-[#037EBD] transition-colors"
          aria-label="Toggle dark mode"
        >
          {mounted && theme === "dark" ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <Link
          href="/login"
          className="bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Login
        </Link>
      </div>

      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-[#037EBD] transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#037EBD] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#037EBD] transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 shadow-lg md:hidden">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active === href
                    ? "text-[#037EBD] bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#037EBD] hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#037EBD] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {mounted && theme === "dark" ? "☀️ Mode Terang" : "🌙 Mode Gelap"}
            </button>
            <Link
              href="/login"
              className="mt-2 bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors text-center"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
