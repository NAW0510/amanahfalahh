"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, MoreVertical, Search } from "lucide-react"

interface Transaksi {
  id: string
  jenis: "penerimaan" | "pengeluaran"
  nama: string
  kategori: string
  nominal: number
  tanggal: string
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?"
}

export default function TransaksiPage() {
  const [list, setList]       = useState<Transaksi[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [dari,   setDari]   = useState("")
  const [sampai, setSampai] = useState("")
  const [jenis,  setJenis]  = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (dari)   params.set("dari",   dari)
    if (sampai) params.set("sampai", sampai)
    if (jenis)  params.set("jenis",  jenis)
    const res = await fetch("/api/admin/transaksi?" + params.toString())
    const data = await res.json()
    setList(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [dari, sampai, jenis])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 overflow-auto">

        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Filter Transaksi</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Tanggal Dari</label>
              <input
                type="date"
                value={dari}
                onChange={(e) => setDari(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#037EBD] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Tanggal Sampai</label>
              <input
                type="date"
                value={sampai}
                onChange={(e) => setSampai(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#037EBD] bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Jenis Transaksi</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#037EBD] bg-gray-50 appearance-none"
            >
              <option value="">Semua</option>
              <option value="penerimaan">Penerimaan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>

        {/* Add Button */}
        <Link
          href="/admin/transaksi/tambah"
          className="inline-flex items-center gap-2 bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors mb-6"
        >
          <Plus size={16} />
          Tambah Transaksi
        </Link>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !list.length ? (
            <div className="px-6 py-14 text-center">
              <p className="text-gray-400 text-sm mb-3">Tidak ada transaksi ditemukan.</p>
              <Link
                href="/admin/transaksi/tambah"
                className="inline-flex items-center gap-2 bg-[#037EBD] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
              >
                <Plus size={14} />
                Tambah Transaksi
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-3 py-3 font-medium">Transaksi</th>
                  <th className="px-3 py-3 font-medium">Kategori</th>
                  <th className="px-3 py-3 font-medium">Tanggal</th>
                  <th className="px-3 py-3 font-medium">Jenis</th>
                  <th className="px-3 py-3 font-medium text-right">Nominal</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((t) => (
                  <tr key={t.id + t.jenis} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#037EBD]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#037EBD] text-[10px] font-bold">{initials(t.nama)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                          {t.nama || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">{t.kategori}</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {new Date(t.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.jenis === "penerimaan"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.jenis === "penerimaan" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {t.jenis === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-right text-gray-800">
                      {fmt(t.nominal)}
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/transaksi/${t.id}?jenis=${t.jenis}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical size={16} />
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
