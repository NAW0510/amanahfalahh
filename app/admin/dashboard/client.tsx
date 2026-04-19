"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, TrendingDown, Wallet, HandHeart, MoreHorizontal } from "lucide-react"
import DashboardChart from "./chart"

// ─── Types ───────────────────────────────────────────────────
type FilterType = null | "penerimaan" | "pengeluaran" | "zakat"

interface Transaction {
  id: string
  jenis: "penerimaan" | "pengeluaran"
  nama: string
  kategori: string
  nominal: number
  tanggal: string
}

interface Stats {
  totalPenerimaan: number
  totalPengeluaran: number
  saldoAkhir: number
  totalZakat: number
}

interface Props {
  stats: Stats
  bulanData: { bulan: string; penerimaan: number; pengeluaran: number }[]
  transactions: Transaction[]
}

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?"
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon,
  active, dimmed, clickable = false,
  onClick,
}: {
  label: string; value: number; icon: React.ElementType
  active: boolean; dimmed: boolean; clickable?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className={`
        rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-sm text-left w-full
        transition-all duration-200
        ${active
          ? "bg-gradient-to-br from-[#037EBD] to-[#025f8f] ring-2 ring-[#037EBD] ring-offset-2 scale-[1.02]"
          : dimmed
            ? "bg-white opacity-50"
            : "bg-white"
        }
        ${clickable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : "cursor-default"}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
          active ? "bg-white/20" : "bg-gray-100"
        }`}>
          <Icon size={16} className={active ? "text-white" : "text-gray-600"} />
        </div>
        {clickable && (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            active ? "border-white bg-white" : "border-gray-300"
          }`}>
            {active && <div className="w-2 h-2 rounded-full bg-[#037EBD]" />}
          </div>
        )}
      </div>
      <div>
        <p className={`text-xs mb-1 ${active ? "text-white/70" : "text-gray-500"}`}>{label}</p>
        <p className={`text-base md:text-xl font-bold ${active ? "text-white" : "text-gray-900"}`}>
          {fmt(value)}
        </p>
      </div>
      {clickable && (
        <p className={`text-[10px] ${active ? "text-white/60" : "text-gray-400"}`}>
          {active ? "Klik untuk reset" : "Klik untuk filter"}
        </p>
      )}
    </button>
  )
}

// ─── Dashboard Client ─────────────────────────────────────────
export default function DashboardClient({ stats, bulanData, transactions }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null)

  const toggle = (filter: FilterType) =>
    setActiveFilter((prev) => (prev === filter ? null : filter))

  const filtered = transactions.filter((t) => {
    if (!activeFilter) return true
    if (activeFilter === "penerimaan") return t.jenis === "penerimaan"
    if (activeFilter === "pengeluaran") return t.jenis === "pengeluaran"
    if (activeFilter === "zakat") return t.jenis === "penerimaan" && t.kategori === "Zakat"
    return true
  })

  const hasDimmed = activeFilter !== null

  // Link ke transaksi page dengan filter
  const transaksiLink =
    activeFilter === "zakat"
      ? "/admin/transaksi"
      : activeFilter
        ? `/admin/transaksi?jenis=${activeFilter}`
        : "/admin/transaksi"

  return (
    <>
      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Total Penerimaan"
          value={stats.totalPenerimaan}
          icon={TrendingUp}
          active={activeFilter === "penerimaan"}
          dimmed={hasDimmed && activeFilter !== "penerimaan"}
          clickable
          onClick={() => toggle("penerimaan")}
        />
        <StatCard
          label="Total Pengeluaran"
          value={stats.totalPengeluaran}
          icon={TrendingDown}
          active={activeFilter === "pengeluaran"}
          dimmed={hasDimmed && activeFilter !== "pengeluaran"}
          clickable
          onClick={() => toggle("pengeluaran")}
        />
        <StatCard
          label="Saldo Akhir"
          value={stats.saldoAkhir}
          icon={Wallet}
          active={false}
          dimmed={false}
          clickable={false}
        />
        <StatCard
          label="Total Zakat"
          value={stats.totalZakat}
          icon={HandHeart}
          active={activeFilter === "zakat"}
          dimmed={hasDimmed && activeFilter !== "zakat"}
          clickable
          onClick={() => toggle("zakat")}
        />
      </div>

      {/* ── Chart ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm">
        <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-4 md:mb-6">
          Overview {new Date().getFullYear()}
        </h2>
        <DashboardChart data={bulanData} />
      </div>

      {/* ── Transaction Table ───────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-semibold text-gray-800">
              Transaction History
            </h2>
            {activeFilter && (
              <span className="text-xs bg-[#037EBD]/10 text-[#037EBD] font-medium px-2 py-0.5 rounded-full capitalize">
                {activeFilter === "zakat" ? "Zakat" : activeFilter}
              </span>
            )}
          </div>
          <Link href={transaksiLink} className="text-[#037EBD] text-xs md:text-sm font-medium hover:underline whitespace-nowrap">
            Lihat Semua →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            {activeFilter
              ? `Tidak ada transaksi ${activeFilter === "zakat" ? "Zakat" : activeFilter} dalam data terbaru.`
              : "Belum ada transaksi."
            }
          </div>
        ) : (
          // Scrollable on mobile
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-4 md:px-6 py-3 font-medium">Transaksi</th>
                  <th className="px-3 md:px-4 py-3 font-medium hidden sm:table-cell">Kategori</th>
                  <th className="px-3 md:px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-3 md:px-4 py-3 font-medium">Jenis</th>
                  <th className="px-3 md:px-4 py-3 font-medium text-right">Nominal</th>
                  <th className="px-3 md:px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.id + t.jenis} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#037EBD]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#037EBD] text-[9px] md:text-[10px] font-bold">
                            {initials(t.nama)}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-800 truncate max-w-[100px] md:max-w-[140px]">
                          {t.nama || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                      {t.kategori}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                      {new Date(t.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 rounded-full ${
                        t.jenis === "penerimaan"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${
                          t.jenis === "penerimaan" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        <span className="hidden sm:inline">
                          {t.jenis === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
                        </span>
                        <span className="sm:hidden">
                          {t.jenis === "penerimaan" ? "In" : "Out"}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm font-semibold text-right text-gray-800 whitespace-nowrap">
                      {fmt(t.nominal)}
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <Link
                        href={`/admin/transaksi/${t.id}?jenis=${t.jenis}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
