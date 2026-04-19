import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TrendingUp, TrendingDown, Wallet, HandHeart, MoreHorizontal } from "lucide-react"
import DashboardChart from "./chart"

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?"
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, active = false,
}: {
  label: string; value: number; icon: React.ElementType; active?: boolean
}) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 shadow-sm ${
      active ? "bg-gradient-to-br from-[#037EBD] to-[#025f8f] text-white" : "bg-white text-gray-800"
    }`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          active ? "bg-white/20" : "bg-gray-100"
        }`}>
          <Icon size={18} className={active ? "text-white" : "text-gray-600"} />
        </div>
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

// ─── Page (Server Component — no waterfall) ───────────────────
export default async function DashboardPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/login")

  const year = new Date().getFullYear()

  // All queries run in parallel — single round-trip
  const [donasiAgg, pengeluaranAgg, zakatAgg, donasiAll, pengeluaranAll, recentDonasi, recentPengeluaran] =
    await Promise.all([
      prisma.donasi.aggregate({ _sum: { nominal: true } }),
      prisma.pengeluaran.aggregate({ _sum: { nominal: true } }),
      prisma.donasi.aggregate({ _sum: { nominal: true }, where: { sumber: "Zakat" } }),
      prisma.donasi.findMany({
        where: { tanggal: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
        select: { tanggal: true, nominal: true },
      }),
      prisma.pengeluaran.findMany({
        where: { tanggal: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
        select: { tanggal: true, nominal: true },
      }),
      prisma.donasi.findMany({
        orderBy: { tanggal: "desc" }, take: 5,
        select: { id: true, nama: true, sumber: true, nominal: true, tanggal: true },
      }),
      prisma.pengeluaran.findMany({
        orderBy: { tanggal: "desc" }, take: 5,
        select: { id: true, nama: true, kategori: true, nominal: true, tanggal: true },
      }),
    ])

  const totalPenerimaan  = donasiAgg._sum.nominal ?? 0
  const totalPengeluaran = pengeluaranAgg._sum.nominal ?? 0
  const saldoAkhir       = totalPenerimaan - totalPengeluaran
  const totalZakat       = zakatAgg._sum.nominal ?? 0

  // Monthly chart data
  const bulanNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const bulanData = bulanNames.map((bulan, i) => ({
    bulan,
    penerimaan: donasiAll
      .filter((d) => new Date(d.tanggal).getMonth() === i)
      .reduce((s, d) => s + d.nominal, 0),
    pengeluaran: pengeluaranAll
      .filter((d) => new Date(d.tanggal).getMonth() === i)
      .reduce((s, d) => s + d.nominal, 0),
  }))

  // Recent transactions (merged + sorted)
  const recent = [
    ...recentDonasi.map((d) => ({ ...d, jenis: "penerimaan" as const, kategori: d.sumber })),
    ...recentPengeluaran.map((p) => ({ ...p, jenis: "pengeluaran" as const })),
  ]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 8)

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex-1 px-8 py-6 overflow-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Penerimaan"  value={totalPenerimaan}  icon={TrendingUp}   active />
          <StatCard label="Total Pengeluaran" value={totalPengeluaran} icon={TrendingDown} />
          <StatCard label="Saldo Akhir"       value={saldoAkhir}       icon={Wallet}       />
          <StatCard label="Total Zakat"       value={totalZakat}       icon={HandHeart}    />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            Overview {year}
          </h2>
          <DashboardChart data={bulanData} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
            <Link href="/admin/transaksi" className="text-[#037EBD] text-sm font-medium hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {recent.length === 0 ? (
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
                {recent.map((t) => (
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
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.jenis === "penerimaan" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
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
