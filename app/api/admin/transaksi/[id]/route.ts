import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

// ── GET /api/admin/transaksi/[id]?jenis= ─────────────────────
export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const jenis = req.nextUrl.searchParams.get("jenis")

  if (jenis === "penerimaan") {
    const d = await prisma.donasi.findUnique({ where: { id } })
    if (!d) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
    return NextResponse.json({ ...d, jenis: "penerimaan", kategori: d.sumber })
  }

  if (jenis === "pengeluaran") {
    const p = await prisma.pengeluaran.findUnique({ where: { id } })
    if (!p) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
    return NextResponse.json({ ...p, jenis: "pengeluaran" })
  }

  return NextResponse.json({ error: "Parameter jenis diperlukan" }, { status: 400 })
}

// ── PUT /api/admin/transaksi/[id]?jenis= ─────────────────────
export async function PUT(req: NextRequest, ctx: Ctx) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const jenis = req.nextUrl.searchParams.get("jenis")
  const body = await req.json()
  const { nama, kategori, rincian, nominal, tanggal, keterangan } = body

  if (jenis === "penerimaan") {
    const updated = await prisma.donasi.update({
      where: { id },
      data: {
        nama,
        sumber: kategori,
        rincian: rincian || null,
        nominal: parseFloat(nominal),
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
      },
    })
    return NextResponse.json({ id: updated.id, jenis: "penerimaan" })
  }

  if (jenis === "pengeluaran") {
    const updated = await prisma.pengeluaran.update({
      where: { id },
      data: {
        nama,
        kategori,
        rincian: rincian || null,
        nominal: parseFloat(nominal),
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
      },
    })
    return NextResponse.json({ id: updated.id, jenis: "pengeluaran" })
  }

  return NextResponse.json({ error: "Parameter jenis diperlukan" }, { status: 400 })
}

// ── DELETE /api/admin/transaksi/[id]?jenis= ──────────────────
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const jenis = req.nextUrl.searchParams.get("jenis")

  if (jenis === "penerimaan") {
    await prisma.donasi.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }

  if (jenis === "pengeluaran") {
    await prisma.pengeluaran.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Parameter jenis diperlukan" }, { status: 400 })
}
