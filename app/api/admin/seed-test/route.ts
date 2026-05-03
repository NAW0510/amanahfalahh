import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// ⚠️  ENDPOINT SEMENTARA — HAPUS SETELAH SEEDING

const NAMA_DONATUR = [
  "Budi Santoso", "Siti Rahayu", "Ahmad Fauzi", "Dewi Lestari", "Rizki Pratama",
  "Nurul Hidayah", "Hendra Wijaya", "Fatimah Azzahra", "Doni Kusuma", "Rina Marlina",
  "Agus Setiawan", "Yuni Astuti", "Irfan Hakim", "Mira Sari", "Teguh Prabowo",
  "Lina Wati", "Bayu Nugroho", "Sari Indah", "Faisal Rahman", "Wati Ningsih",
]

const NAMA_PROGRAM = [
  "Pembelian Seragam Anak", "Biaya Listrik & Air", "Gaji Pengasuh", "Perbaikan Gedung",
  "Pembelian Buku & Alat Tulis", "Kegiatan Pesantren Kilat", "Biaya Internet",
  "Pembelian Bahan Makanan", "Biaya Transportasi", "Perlengkapan Ibadah",
  "Kegiatan HUT RI", "Biaya Kesehatan Anak", "Honor Guru Ngaji", "Pembelian Kasur",
  "Kegiatan Hari Raya", "Biaya Kebersihan", "Pembelian Seragam Olahraga",
  "Biaya Fotokopi & ATK", "Pelatihan Keterampilan", "Biaya Telepon",
]

const SUMBER   = ["Zakat", "Infaq", "Shadaqah", "Hibah", "Wakaf"]
const KATEGORI = ["Operasional", "Program Anak", "SDM & Honor", "Lain-lain"]

const RINCIAN_DONASI: Record<string, string[]> = {
  Zakat:    ["Zakat Maal", "Zakat Fitrah", "Zakat Penghasilan"],
  Infaq:    ["Infaq Rutin", "Infaq Pembangunan", "Infaq Pendidikan"],
  Shadaqah: ["Shadaqah Umum", "Shadaqah Jariyah", "Shadaqah Makanan"],
  Hibah:    ["Hibah Perorangan", "Hibah Instansi", "Hibah Yayasan"],
  Wakaf:    ["Wakaf Tunai", "Wakaf Produktif", "Wakaf Sarana"],
}

const RINCIAN_PENGELUARAN: Record<string, string[]> = {
  "Operasional":   ["Listrik & Air", "Internet & Telepon", "Kebersihan", "Perlengkapan Kantor"],
  "Program Anak":  ["Pendidikan", "Kesehatan", "Kegiatan Sosial", "Perlengkapan Anak"],
  "SDM & Honor":   ["Gaji Pengasuh", "Honor Guru", "Tunjangan", "Pelatihan SDM"],
  "Lain-lain":     ["Biaya Tak Terduga", "Pemeliharaan Gedung", "Transportasi", "Lain-lain"],
}

const NOMINAL_DONASI = [
  50_000, 75_000, 100_000, 150_000, 200_000,
  250_000, 300_000, 500_000, 750_000, 1_000_000,
  1_500_000, 2_000_000, 2_500_000, 5_000_000,
]
const NOMINAL_KELUAR = [
  25_000, 50_000, 75_000, 100_000, 150_000,
  200_000, 300_000, 500_000, 750_000, 1_000_000,
  1_200_000, 1_500_000, 2_000_000, 3_000_000,
]
const BANK = ["BCA", "BRI", "Mandiri", "BSI", "BNI"]
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni",
               "Juli","Agustus","September","Oktober","November","Desember"]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function rDate() { return new Date(2025, rInt(0, 11), rInt(1, 28)) }

export async function POST() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const donasiData = Array.from({ length: 60 }, (_, i) => {
    const sumber = SUMBER[i % SUMBER.length]
    return {
      nama:       pick(NAMA_DONATUR),
      sumber,
      rincian:    pick(RINCIAN_DONASI[sumber]),
      nominal:    pick(NOMINAL_DONASI),
      tanggal:    rDate(),
      keterangan: Math.random() > 0.5 ? `Transfer via ${pick(BANK)}` : null,
      userId,
    }
  })

  const pengeluaranData = Array.from({ length: 40 }, (_, i) => {
    const kategori = KATEGORI[i % KATEGORI.length]
    return {
      nama:       pick(NAMA_PROGRAM),
      kategori,
      rincian:    pick(RINCIAN_PENGELUARAN[kategori]),
      nominal:    pick(NOMINAL_KELUAR),
      tanggal:    rDate(),
      keterangan: Math.random() > 0.5 ? `Bulan ${pick(BULAN)}` : null,
      userId,
    }
  })

  const [d, p] = await Promise.all([
    prisma.donasi.createMany({ data: donasiData }),
    prisma.pengeluaran.createMany({ data: pengeluaranData }),
  ])

  return NextResponse.json({
    ok: true,
    donasi: d.count,
    pengeluaran: p.count,
    total: d.count + p.count,
  })
}
