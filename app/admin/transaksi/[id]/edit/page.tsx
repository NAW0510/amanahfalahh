"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

const KATEGORI_MAP: Record<string, { rincian: string[]; deskripsi: string }> = {
  Zakat:          { rincian: ["Zakat Mal","Zakat Fitrah","Zakat Profesi"], deskripsi: "Dana zakat wajib sesuai nisab dan haul." },
  Infaq:          { rincian: ["Infaq Rutin","Infaq Khusus","Infaq Ramadhan"], deskripsi: "Dana infaq sukarela di luar kewajiban zakat." },
  Shadaqah:       { rincian: ["Shadaqah Biasa","Shadaqah Jariyah"], deskripsi: "Pemberian sukarela yang ikhlas." },
  Hibah:          { rincian: ["Hibah Pribadi","Hibah Lembaga","Hibah Pemerintah"], deskripsi: "Pemberian aset atau dana secara cuma-cuma." },
  Wakaf:          { rincian: ["Wakaf Tunai","Wakaf Benda"], deskripsi: "Harta yang diwakafkan secara berkelanjutan." },
  Operasional:    { rincian: ["Listrik & Air","Internet & Komunikasi","ATK & Perlengkapan","Sewa & Pemeliharaan"], deskripsi: "Biaya operasional rutin panti." },
  "Program Anak": { rincian: ["Pendidikan","Kesehatan","Kegiatan Asrama","Beasiswa"], deskripsi: "Program pemberdayaan anak asuh." },
  "SDM & Honor":  { rincian: ["Gaji Pengurus","Honor Pembimbing","Tunjangan"], deskripsi: "Kompensasi untuk pengurus dan pembimbing." },
  "Lain-lain":    { rincian: ["Tidak Terkategori"], deskripsi: "Pengeluaran lain." },
}

const PENERIMAAN_KATEGORI = ["Zakat","Infaq","Shadaqah","Hibah","Wakaf"]
const PENGELUARAN_KATEGORI = ["Operasional","Program Anak","SDM & Honor","Lain-lain"]

export default function EditTransaksiPage() {
  const params       = useParams()
  const searchParams = useSearchParams()
  const router       = useRouter()
  const id           = params.id as string
  const jenis        = searchParams.get("jenis") ?? ""

  const [form, setForm] = useState({
    nama: "", kategori: "", rincian: "", nominal: "", tanggal: "", keterangan: "",
  })
  const [loading, setSaving] = useState(false)
  const [error, setError]    = useState("")

  useEffect(() => {
    fetch(`/api/admin/transaksi/${id}?jenis=${jenis}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          nama:       d.nama ?? "",
          kategori:   d.kategori ?? "",
          rincian:    d.rincian ?? "",
          nominal:    String(d.nominal ?? ""),
          tanggal:    d.tanggal?.split("T")[0] ?? "",
          keterangan: d.keterangan ?? "",
        })
      })
  }, [id, jenis])

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const kategoriOptions = jenis === "penerimaan" ? PENERIMAAN_KATEGORI : PENGELUARAN_KATEGORI
  const rincianOptions  = form.kategori ? (KATEGORI_MAP[form.kategori]?.rincian ?? []) : []
  const deskripsiAkun   = form.kategori ? (KATEGORI_MAP[form.kategori]?.deskripsi ?? "") : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/transaksi/${id}?jenis=${jenis}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, nominal: parseFloat(form.nominal) }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || "Gagal.") }
      else { router.push(`/admin/transaksi/${id}?jenis=${jenis}`); router.refresh() }
    } catch { setError("Terjadi kesalahan jaringan.") }
    finally  { setSaving(false) }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
      </div>
      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-7">Edit Transaksi</h2>
          <div className="bg-gray-50 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Nama Transaksi</label>
                  <input type="text" value={form.nama} onChange={(e) => set("nama", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Jenis Transaksi</label>
                  <input type="text" value={jenis === "penerimaan" ? "Penerimaan" : "Pengeluaran"} readOnly
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Kategori Akun</label>
                  <select value={form.kategori} onChange={(e) => set("kategori", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] appearance-none">
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Rincian Akun</label>
                  <select value={form.rincian} onChange={(e) => set("rincian", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] appearance-none">
                    <option value="">Pilih Rincian</option>
                    {rincianOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Nominal</label>
                  <input type="number" value={form.nominal} onChange={(e) => set("nominal", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD]" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">Keterangan (Opsional)</label>
                <textarea rows={3} value={form.keterangan} onChange={(e) => set("keterangan", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#037EBD] resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">Deskripsi Akun (Otomatis)</label>
                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 min-h-[44px]">
                  {deskripsiAkun || "(Deskripsi Akun Akan Muncul Di sini)"}
                </div>
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => router.back()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors">
                  <ArrowLeft size={15} /> Kembali
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold transition-colors disabled:opacity-60">
                  <Save size={15} /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
