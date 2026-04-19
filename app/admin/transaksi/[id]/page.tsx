"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface Transaksi {
  id: string
  jenis: "penerimaan" | "pengeluaran"
  nama: string
  kategori: string
  rincian: string | null
  nominal: number
  tanggal: string
  keterangan: string | null
  createdAt: string
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value || "—"}</span>
    </div>
  )
}

export default function TransaksiDetailPage() {
  const params        = useParams()
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const id            = params.id as string
  const jenis         = searchParams.get("jenis") ?? ""

  const [data, setData]         = useState<Transaksi | null>(null)
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!id || !jenis) return
    fetch(`/api/admin/transaksi/${id}?jenis=${jenis}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id, jenis])

  const handleDelete = async () => {
    setDeleting(true)
    await fetch(`/api/admin/transaksi/${id}?jenis=${jenis}`, { method: "DELETE" })
    router.push("/admin/transaksi")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#037EBD] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Transaksi tidak ditemukan.</p>
        <Link href="/admin/transaksi" className="text-[#037EBD] text-sm hover:underline">
          Kembali ke daftar
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
      </div>

      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-7">Detail Transaksi</h2>

          <div className="mb-8">
            <DetailRow label="Nama Transaksi" value={data.nama} />
            <DetailRow
              label="Tanggal"
              value={new Date(data.tanggal).toLocaleDateString("id-ID", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            />
            <DetailRow
              label="Jenis"
              value={data.jenis === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
            />
            <DetailRow label="Kategori Akun" value={data.kategori} />
            <DetailRow label="Rincian Akun" value={data.rincian} />
            <DetailRow label="Nominal" value={fmt(data.nominal)} />
            <DetailRow label="Keterangan" value={data.keterangan} />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={15} />
              Kembali
            </button>
            <Link
              href={`/admin/transaksi/${id}/edit?jenis=${jenis}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold transition-colors"
            >
              <Pencil size={15} />
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              <Trash2 size={15} />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Data <span className="font-semibold text-gray-800">{data.nama}</span> akan dihapus
              secara permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm font-medium text-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
