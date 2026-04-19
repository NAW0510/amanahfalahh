"use client"

import { useEffect, useState } from "react"
import { Search, MoreHorizontal, TrendingUp, TrendingDown, Wallet, HandHeart } from "lucide-react"
import Link from "next/link"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"

// ─── Types ───────────────────────────────────────────────────
interface DashboardData {
  totalPenerimaan: number
  totalPengeluaran: number
  saldoAkhir: number
  totalZakat: number
  bulanData: { bulan: string; penerimaan: number; pengeluaran: number }[]
  recent: {
    id: string; jenis: "penerimaan" | "pengeluaran"
    nama: string; kategori: string; nominal: number; tanggal: string
  }[]
}

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) =>
  "Rp " + n.toLocaleString("id-ID")

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, active = false,
}: {
  label: string; value: number; icon: React.ElementType; active?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-3 shadow-sm ${
        active
          ? "bg-gradient-to-br from-[#037EBD] to-[#025f8f] text-white"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            active ? "bg-white/20" : "bg-gray-100"
          }`}
        >
          <Icon size={18} className={active ? "text-white" : "text-gray-600"} />
        </div>
        <button className={active ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-600"}>
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div>
        <p className={`text-xs mb-1 ${active ? "text-white/70" : "text-gray-500"}`}>{label}</p>
        <p className={`text-xl font-bold ${active ? "text-white" : "text-gray-900"}`}>
          {fmt(value)}
        </p>
      </div>
    </div>
  )
}

// ─── Custom Tooltip ──────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "penerimaan" ? "Penerimaan" : "Pengeluaran"}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6 overflow-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-32 animate-pulse" />
            ))
          ) : data ? (
            <>
              <StatCard label="Total Penerimaan" value={data.totalPenerimaan} icon={TrendingUp}   active />
              <StatCard label="Total Pengeluaran" value={data.totalPengeluaran} icon={TrendingDown} />
              <StatCard label="Saldo Akhir"       value={data.saldoAkhir}       icon={Wallet}       />
              <StatCard label="Total Zakat"        value={data.totalZakat}       icon={HandHeart}    />
            </>
          ) : (
            <p className="col-span-4 text-gray-500 text-sm">Gagal memuat data.</p>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-6">Overview {new Date().getFullYear()}</h2>
          {loading ? (
            <div className="h-52 animate-pulse bg-gray-100 rounded-xl" />
          ) : data ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.bulanData} barSize={14} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB", radius: 4 }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  formatter={(v) => v === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
                />
                <Bar dataKey="penerimaan" fill="#037EBD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
            <Link
              href="/admin/transaksi"
              className="text-[#037EBD] text-sm font-medium hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !data?.recent?.length ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              Belum ada transaksi.{" "}
              <Link href="/admin/transaksi/tambah" className="text-[#037EBD] hover:underline">
                Tambah sekarang
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Transaksi</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Jenis</th>
                  <th className="px-4 py-3 font-medium text-right">Nominal</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recent.map((t) => (
                  <tr key={t.id + t.jenis} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#037EBD]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#037EBD] text-[10px] font-bold">{initials(t.nama)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
                          {t.nama || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.kategori}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(t.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          t.jenis === "penerimaan"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.jenis === "penerimaan" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {t.jenis === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-gray-800">
                      {fmt(t.nominal)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/transaksi/${t.id}?jenis=${t.jenis}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
