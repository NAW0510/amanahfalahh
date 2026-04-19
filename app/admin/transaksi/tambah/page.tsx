"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

// ─── Kategori options ─────────────────────────────────────────
const KATEGORI_MAP: Record<string, { rincian: string[]; deskripsi: string }> = {
  // Penerimaan
  Zakat: {
    rincian: ["Zakat Mal", "Zakat Fitrah", "Zakat Profesi"],
    deskripsi: "Dana zakat yang wajib dikeluarkan oleh muzaki sesuai nisab dan haul.",
  },
  Infaq: {
    rincian: ["Infaq Rutin", "Infaq Khusus", "Infaq Ramadhan"],
    deskripsi: "Dana infaq sukarela yang dikeluarkan di luar kewajiban zakat.",
  },
  Shadaqah: {
    rincian: ["Shadaqah Biasa", "Shadaqah Jariyah"],
    deskripsi: "Pemberian sukarela yang ikhlas tanpa mengharap imbalan.",
  },
  Hibah: {
    rincian: ["Hibah Pribadi", "Hibah Lembaga", "Hibah Pemerintah"],
    deskripsi: "Pemberian aset atau dana secara cuma-cuma kepada panti.",
  },
  Wakaf: {
    rincian: ["Wakaf Tunai", "Wakaf Benda"],
    deskripsi: "Harta yang diwakafkan untuk dimanfaatkan secara berkelanjutan.",
  },
  // Pengeluaran
  Operasional: {
    rincian: ["Listrik & Air", "Internet & Komunikasi", "ATK & Perlengkapan", "Sewa & Pemeliharaan"],
    deskripsi: "Biaya operasional rutin untuk mendukung kegiatan panti sehari-hari.",
  },
  "Program Anak": {
    rincian: ["Pendidikan", "Kesehatan", "Kegiatan Asrama", "Beasiswa"],
    deskripsi: "Pengeluaran untuk program pemberdayaan dan pengembangan anak asuh.",
  },
  "SDM & Honor": {
    rincian: ["Gaji Pengurus", "Honor Pembimbing", "Tunjangan"],
    deskripsi: "Kompensasi untuk pengurus dan tenaga pembimbing panti.",
  },
  "Lain-lain": {
    rincian: ["Tidak Terkategori"],
    deskripsi: "Pengeluaran lain yang tidak termasuk dalam kategori di atas.",
  },
}

const PENERIMAAN_KATEGORI = ["Zakat", "Infaq", "Shadaqah", "Hibah", "Wakaf"]
const PENGELUARAN_KATEGORI = ["Operasional", "Program Anak", "SDM & Honor", "Lain-lain"]

export default function TambahTransaksiPage() {
  const router = useRouter()
  const [loading, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    jenis: "",
    nama: "",
    kategori: "",
    rincian: "",
    nominal: "",
    tanggal: new Date().toISOString().split("T")[0],
    keterangan: "",
  })

  const set = (k: string, v: string) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v }
      if (k === "jenis") { next.kategori = ""; next.rincian = "" }
      if (k === "kategori") { next.rincian = "" }
      return next
    })
  }

  const kategoriOptions =
    form.jenis === "penerimaan" ? PENERIMAAN_KATEGORI
    : form.jenis === "pengeluaran" ? PENGELUARAN_KATEGORI
    : []

  const rincianOptions = form.kategori ? (KATEGORI_MAP[form.kategori]?.rincian ?? []) : []
  const deskripsiAkun  = form.kategori ? (KATEGORI_MAP[form.kategori]?.deskripsi ?? "") : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.jenis || !form.nama || !form.kategori || !form.nominal || !form.tanggal) {
      setError("Semua field wajib harus diisi.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nominal: parseFloat(form.nominal.replace(/\D/g, "")),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || "Gagal menyimpan transaksi.")
      } else {
        router.push("/admin/transaksi")
        router.refresh()
      }
    } catch {
      setError("Terjadi kesalahan jaringan.")
    } finally {
      setSaving(false)
    }
  }

  const handleNominalChange = (v: string) => {
    const digits = v.replace(/\D/g, "")
    set("nominal", digits ? parseInt(digits).toLocaleString("id-ID") : "")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
      </div>

      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-7">
            Manajemen Transaksi
          </h2>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Tambah Transaksi</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Nama Transaksi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Donasi Pak Fauzan"
                    value={form.nama}
                    onChange={(e) => set("nama", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Jenis Transaksi</label>
                  <select
                    value={form.jenis}
                    onChange={(e) => set("jenis", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] appearance-none"
                  >
                    <option value="">Pilih Jenis Transaksi</option>
                    <option value="penerimaan">Penerimaan</option>
                    <option value="pengeluaran">Pengeluaran</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Kategori Akun</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => set("kategori", e.target.value)}
                    disabled={!form.jenis}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] appearance-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kategori Akun</option>
                    {kategoriOptions.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Rincian Akun</label>
                  <select
                    value={form.rincian}
                    onChange={(e) => set("rincian", e.target.value)}
                    disabled={!form.kategori}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] appearance-none disabled:opacity-50"
                  >
                    <option value="">Pilih Rincian</option>
                    {rincianOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Nominal</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp 0"
                    value={form.nominal ? "Rp " + form.nominal : ""}
                    onChange={(e) => handleNominalChange(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => set("tanggal", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]"
                  />
                </div>
              </div>

              {/* Deskripsi Tambahan */}
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Deskripsi Tambahan <span className="text-gray-400">(Opsional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pemberian untuk acara 17 Agustus"
                  value={form.keterangan}
                  onChange={(e) => set("keterangan", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] resize-none"
                />
              </div>

              {/* Deskripsi Akun (auto) */}
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Deskripsi Akun <span className="text-gray-400">(Otomatis)</span>
                </label>
                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 min-h-[44px]">
                  {deskripsiAkun || "(Deskripsi Akun Akan Muncul Di sini)"}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
                >
                  <ArrowLeft size={15} />
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  <Save size={15} />
                  {loading ? "Menyimpan..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
