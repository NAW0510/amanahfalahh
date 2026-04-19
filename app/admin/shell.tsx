"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import AdminSidebar from "./sidebar"

interface Props {
  children: React.ReactNode
  userName?: string | null
  userEmail?: string | null
}

export default function AdminShell({ children, userName, userEmail }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <AdminSidebar
        userName={userName}
        userEmail={userEmail}
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen md:ml-[220px]">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#037EBD] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">AF</span>
            </div>
            <span className="text-white font-bold text-sm tracking-wide">AMANAH FALAH</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
