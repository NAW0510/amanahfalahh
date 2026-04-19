import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const year = now.getFullYear()

  // Aggregate totals
  const [donasiAgg, pengeluaranAgg, zakatAgg] = await Promise.all([
    prisma.donasi.aggregate({ _sum: { nominal: true } }),
    prisma.pengeluaran.aggregate({ _sum: { nominal: true } }),
    prisma.donasi.aggregate({
      _sum: { nominal: true },
      where: { sumber: "Zakat" },
    }),
  ])

  const totalPenerimaan = donasiAgg._sum.nominal ?? 0
  const totalPengeluaran = pengeluaranAgg._sum.nominal ?? 0
  const saldoAkhir = totalPenerimaan - totalPengeluaran
  const totalZakat = zakatAgg._sum.nominal ?? 0

  // Monthly data for current year
  const [donasiAll, pengeluaranAll] = await Promise.all([
    prisma.donasi.findMany({
      where: {
        tanggal: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
      },
      select: { tanggal: true, nominal: true },
    }),
    prisma.pengeluaran.findMany({
      where: {
        tanggal: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
      },
      select: { tanggal: true, nominal: true },
    }),
  ])

  const bulanNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const bulanData = bulanNames.map((bulan, i) => {
    const penerimaan = donasiAll
      .filter((d) => new Date(d.tanggal).getMonth() === i)
      .reduce((sum, d) => sum + d.nominal, 0)
    const pengeluaran = pengeluaranAll
      .filter((d) => new Date(d.tanggal).getMonth() === i)
      .reduce((sum, d) => sum + d.nominal, 0)
    return { bulan, penerimaan, pengeluaran }
  })

  // Recent 5 transactions (combined)
  const [recentDonasi, recentPengeluaran] = await Promise.all([
    prisma.donasi.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
      select: { id: true, nama: true, sumber: true, nominal: true, tanggal: true },
    }),
    prisma.pengeluaran.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
      select: { id: true, nama: true, kategori: true, nominal: true, tanggal: true },
    }),
  ])

  const recent = [
    ...recentDonasi.map((d) => ({ ...d, jenis: "penerimaan" as const, kategori: d.sumber })),
    ...recentPengeluaran.map((p) => ({ ...p, jenis: "pengeluaran" as const })),
  ]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 8)

  return NextResponse.json({
    totalPenerimaan,
    totalPengeluaran,
    saldoAkhir,
    totalZakat,
    bulanData,
    recent,
  })
}
