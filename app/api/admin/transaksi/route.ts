import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// ── GET /api/admin/transaksi?dari=&sampai=&jenis= ─────────────
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const dari   = searchParams.get("dari")
  const sampai = searchParams.get("sampai")
  const jenis  = searchParams.get("jenis") // "penerimaan" | "pengeluaran" | null

  const dateFilter = {
    ...(dari   ? { gte: new Date(dari) }   : {}),
    ...(sampai ? { lte: new Date(sampai) } : {}),
  }

  const results: {
    id: string; jenis: "penerimaan" | "pengeluaran"
    nama: string; kategori: string; rincian: string | null
    nominal: number; tanggal: Date; keterangan: string | null; createdAt: Date
  }[] = []

  if (!jenis || jenis === "penerimaan") {
    const donasi = await prisma.donasi.findMany({
      where: Object.keys(dateFilter).length ? { tanggal: dateFilter } : undefined,
      orderBy: { tanggal: "desc" },
      select: {
        id: true, nama: true, sumber: true, rincian: true,
        nominal: true, tanggal: true, keterangan: true, createdAt: true,
      },
    })
    donasi.forEach((d) =>
      results.push({ ...d, jenis: "penerimaan", kategori: d.sumber })
    )
  }

  if (!jenis || jenis === "pengeluaran") {
    const pengeluaran = await prisma.pengeluaran.findMany({
      where: Object.keys(dateFilter).length ? { tanggal: dateFilter } : undefined,
      orderBy: { tanggal: "desc" },
      select: {
        id: true, nama: true, kategori: true, rincian: true,
        nominal: true, tanggal: true, keterangan: true, createdAt: true,
      },
    })
    pengeluaran.forEach((p) => results.push({ ...p, jenis: "pengeluaran" }))
  }

  results.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())

  return NextResponse.json(results)
}

// ── POST /api/admin/transaksi ─────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { jenis, nama, kategori, rincian, nominal, tanggal, keterangan } = body

  if (!jenis || !nama || !kategori || !nominal || !tanggal) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
  }

  const userId = session.user.id

  if (jenis === "penerimaan") {
    const donasi = await prisma.donasi.create({
      data: {
        nama,
        sumber: kategori,
        rincian: rincian || null,
        nominal: parseFloat(nominal),
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
        userId,
      },
    })
    return NextResponse.json({ id: donasi.id, jenis: "penerimaan" }, { status: 201 })
  }

  if (jenis === "pengeluaran") {
    const pengeluaran = await prisma.pengeluaran.create({
      data: {
        nama,
        kategori,
        rincian: rincian || null,
        nominal: parseFloat(nominal),
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
        userId,
      },
    })
    return NextResponse.json({ id: pengeluaran.id, jenis: "pengeluaran" }, { status: 201 })
  }

  return NextResponse.json({ error: "Jenis tidak valid" }, { status: 400 })
}
