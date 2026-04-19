import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import DashboardClient from "./client"

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

  // Recent transactions (merged + sorted) — tanggal serialised to ISO string for client prop
  const transactions = [
    ...recentDonasi.map((d) => ({
      id: d.id,
      jenis: "penerimaan" as const,
      nama: d.nama,
      kategori: d.sumber,
      nominal: d.nominal,
      tanggal: d.tanggal.toISOString(),
    })),
    ...recentPengeluaran.map((p) => ({
      id: p.id,
      jenis: "pengeluaran" as const,
      nama: p.nama,
      kategori: p.kategori,
      nominal: p.nominal,
      tanggal: p.tanggal.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 8)

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-white border-b border-gray-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex-1 px-4 md:px-8 py-4 md:py-6 overflow-auto">
        <DashboardClient
          stats={{ totalPenerimaan, totalPengeluaran, saldoAkhir, totalZakat }}
          bulanData={bulanData}
          transactions={transactions}
        />
      </div>
    </div>
  )
}
