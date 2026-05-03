import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const SUMBER_PENERIMAAN = ["Zakat", "Infaq", "Shadaqah", "Hibah", "Wakaf"]
const KATEGORI_PENGELUARAN = ["Operasional", "Program Anak", "SDM & Honor", "Lain-lain"]

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const dari   = searchParams.get("dari")
  const sampai = searchParams.get("sampai")
  const jenis  = searchParams.get("jenis") ?? "semua"

  // Build date filter
  const dateFilter: Record<string, Date> = {}
  if (dari)   dateFilter.gte = new Date(dari)
  if (sampai) dateFilter.lte = new Date(sampai + "T23:59:59.999Z")
  const where = Object.keys(dateFilter).length ? { tanggal: dateFilter } : {}

  const [donasi, pengeluaran] = await Promise.all([
    jenis !== "pengeluaran"
      ? prisma.donasi.findMany({
          where,
          orderBy: { tanggal: "asc" },
          select: { id: true, nama: true, sumber: true, rincian: true, nominal: true, tanggal: true, keterangan: true },
        })
      : Promise.resolve([]),
    jenis !== "penerimaan"
      ? prisma.pengeluaran.findMany({
          where,
          orderBy: { tanggal: "asc" },
          select: { id: true, nama: true, kategori: true, rincian: true, nominal: true, tanggal: true, keterangan: true },
        })
      : Promise.resolve([]),
  ])

  const totalPenerimaan  = donasi.reduce((s, d) => s + d.nominal, 0)
  const totalPengeluaran = pengeluaran.reduce((s, p) => s + p.nominal, 0)

  return NextResponse.json({
    summary: {
      ringkasanPenerimaan: SUMBER_PENERIMAAN.map((kat) => ({
        kategori: kat,
        total: donasi.filter((d) => d.sumber === kat).reduce((s, d) => s + d.nominal, 0),
      })),
      ringkasanPengeluaran: KATEGORI_PENGELUARAN.map((kat) => ({
        kategori: kat,
        total: pengeluaran.filter((p) => p.kategori === kat).reduce((s, p) => s + p.nominal, 0),
      })),
      totalPenerimaan,
      totalPengeluaran,
      saldoAkhir: totalPenerimaan - totalPengeluaran,
    },
    donasi: donasi.map((d) => ({ ...d, tanggal: d.tanggal.toISOString() })),
    pengeluaran: pengeluaran.map((p) => ({ ...p, tanggal: p.tanggal.toISOString() })),
  })
}
