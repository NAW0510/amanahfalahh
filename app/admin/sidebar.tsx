"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard, ArrowLeftRight,
  FileText, Settings, LogOut,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/transaksi", label: "Transaksi",     icon: ArrowLeftRight  },
  { href: "/admin/laporan",   label: "Laporan Falah", icon: FileText        },
  { href: "/admin/settings",  label: "Settings",      icon: Settings        },
]

interface Props {
  userName?: string | null
  userEmail?: string | null
}

export default function AdminSidebar({ userName, userEmail }: Props) {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-[#037EBD] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-xs font-bold">AF</span>
        </div>
        <span className="text-white font-bold text-sm tracking-wide">AMANAH FALAH</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Manage
        </p>
        <div className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#037EBD]"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {userName?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{userName ?? "Admin"}</p>
            <p className="text-white/60 text-[10px] truncate">{userEmail ?? ""}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
