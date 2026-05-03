"use client"

import { useState, useEffect, useCallback } from "react"
import { FileText, Table2, Loader2, AlertCircle, RefreshCw } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────
type Jenis = "semua" | "penerimaan" | "pengeluaran"

interface RingkasanItem { kategori: string; total: number }

interface LaporanData {
  summary: {
    ringkasanPenerimaan: RingkasanItem[]
    ringkasanPengeluaran: RingkasanItem[]
    totalPenerimaan: number
    totalPengeluaran: number
    saldoAkhir: number
  }
  donasi: {
    id: string; nama: string; sumber: string
    rincian: string | null; nominal: number
    tanggal: string; keterangan: string | null
  }[]
  pengeluaran: {
    id: string; nama: string; kategori: string
    rincian: string | null; nominal: number
    tanggal: string; keterangan: string | null
  }[]
}

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function fmtTgl(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function fmtTglLong(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

function periodeLabel(dari: string, sampai: string) {
  if (dari && sampai)  return `${fmtTglLong(dari + "T00:00:00")} s/d ${fmtTglLong(sampai + "T00:00:00")}`
  if (dari)            return `Mulai ${fmtTglLong(dari + "T00:00:00")}`
  if (sampai)          return `S/d ${fmtTglLong(sampai + "T00:00:00")}`
  return "Semua Periode"
}

// ─── Page ─────────────────────────────────────────────────────
export default function LaporanPage() {
  const [dari,      setDari]      = useState("")
  const [sampai,    setSampai]    = useState("")
  const [jenis,     setJenis]     = useState<Jenis>("semua")
  const [data,      setData]      = useState<LaporanData | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null)

  // ── Fetch data (auto on mount + filter change) ──────────────
  const fetchData = useCallback(async (): Promise<LaporanData | null> => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (dari)   params.set("dari",   dari)
      if (sampai) params.set("sampai", sampai)
      params.set("jenis", jenis)

      const res = await fetch(`/api/admin/laporan?${params}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `HTTP ${res.status}`)
      }
      const json: LaporanData = await res.json()
      setData(json)
      return json
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data"
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [dari, sampai, jenis])

  // Auto-fetch on mount and whenever filters change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Export PDF ──────────────────────────────────────────────
  async function handleExportPDF() {
    setExporting("pdf")
    try {
      const d = data ?? await fetchData()
      if (!d) { setExporting(null); return }

      const { jsPDF }              = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const W   = doc.internal.pageSize.getWidth()

      const BLUE:       [number, number, number] = [3, 126, 189]
      const LIGHT_BLUE: [number, number, number] = [219, 239, 247]
      const WHITE:      [number, number, number] = [255, 255, 255]
      const GRAY:       [number, number, number] = [100, 100, 100]
      const GREEN:      [number, number, number] = [22, 163, 74]
      const RED:        [number, number, number] = [220, 38, 38]

      // ── Header ─────────────────────────────────────────────
      doc.setFillColor(...BLUE)
      doc.rect(0, 0, W, 42, "F")
      doc.setTextColor(...WHITE)
      doc.setFont("helvetica", "bold");   doc.setFontSize(13)
      doc.text("YAYASAN AMANAH FALAH", W / 2, 13, { align: "center" })
      doc.setFont("helvetica", "normal"); doc.setFontSize(9)
      doc.text("LAPORAN PENERIMAAN DAN PENGELUARAN KAS", W / 2, 22, { align: "center" })
      doc.setFontSize(8)
      doc.text(`Periode: ${periodeLabel(dari, sampai)}`, W / 2, 30, { align: "center" })
      doc.setFontSize(7)
      doc.text(
        `Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`,
        W / 2, 37, { align: "center" },
      )

      let y = 50

      // ── Tabel Penerimaan ────────────────────────────────────
      if (jenis !== "pengeluaran") {
        doc.setFont("helvetica", "bold"); doc.setFontSize(9)
        doc.setTextColor(...BLUE)
        doc.text("I.  PENERIMAAN", 14, y); y += 2

        autoTable(doc, {
          startY: y,
          margin: { left: 14, right: 14 },
          head: [],
          body: [
            ...d.summary.ringkasanPenerimaan.map((r, i) => [`  ${i + 1}.`, r.kategori, fmt(r.total)]),
            ["", "Total Penerimaan", fmt(d.summary.totalPenerimaan)],
          ],
          columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 90 }, 2: { cellWidth: 70, halign: "right" } },
          styles: { fontSize: 9, cellPadding: [2, 3, 2, 3], textColor: [30, 30, 30] },
          didParseCell(hookData) {
            const lastRow = hookData.table.body.length - 1
            if (hookData.row.index === lastRow) {
              hookData.cell.styles.fontStyle = "bold"
              hookData.cell.styles.fillColor = LIGHT_BLUE
              hookData.cell.styles.textColor = GREEN
            }
          },
        })
        y = (doc as any).lastAutoTable.finalY + 8
      }

      // ── Tabel Pengeluaran ───────────────────────────────────
      if (jenis !== "penerimaan") {
        doc.setFont("helvetica", "bold"); doc.setFontSize(9)
        doc.setTextColor(...BLUE)
        doc.text("II.  PENGELUARAN", 14, y); y += 2

        autoTable(doc, {
          startY: y,
          margin: { left: 14, right: 14 },
          head: [],
          body: [
            ...d.summary.ringkasanPengeluaran.map((r, i) => [`  ${i + 1}.`, r.kategori, fmt(r.total)]),
            ["", "Total Pengeluaran", fmt(d.summary.totalPengeluaran)],
          ],
          columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 90 }, 2: { cellWidth: 70, halign: "right" } },
          styles: { fontSize: 9, cellPadding: [2, 3, 2, 3], textColor: [30, 30, 30] },
          didParseCell(hookData) {
            const lastRow = hookData.table.body.length - 1
            if (hookData.row.index === lastRow) {
              hookData.cell.styles.fontStyle = "bold"
              hookData.cell.styles.fillColor = [255, 235, 235] as [number, number, number]
              hookData.cell.styles.textColor = RED
            }
          },
        })
        y = (doc as any).lastAutoTable.finalY + 8
      }

      // ── Saldo Akhir ─────────────────────────────────────────
      if (jenis === "semua") {
        autoTable(doc, {
          startY: y,
          margin: { left: 14, right: 14 },
          head: [],
          body: [["", "SALDO AKHIR", fmt(d.summary.saldoAkhir)]],
          columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 90 }, 2: { cellWidth: 70, halign: "right" } },
          styles: { fontSize: 10, fontStyle: "bold", cellPadding: [3, 3, 3, 3], fillColor: BLUE, textColor: WHITE },
        })
        y = (doc as any).lastAutoTable.finalY + 12
      }

      // ── Detail Transaksi ────────────────────────────────────
      doc.setFont("helvetica", "bold"); doc.setFontSize(9)
      doc.setTextColor(...BLUE)
      doc.text("DETAIL TRANSAKSI", 14, y); y += 2

      const allTx = [
        ...d.donasi.map((tx) => ({
          tanggal: tx.tanggal, nama: tx.nama,
          jenis: "Penerimaan", kategori: tx.sumber, nominal: tx.nominal,
        })),
        ...d.pengeluaran.map((tx) => ({
          tanggal: tx.tanggal, nama: tx.nama,
          jenis: "Pengeluaran", kategori: tx.kategori, nominal: tx.nominal,
        })),
      ].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())

      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        head: [["No", "Tanggal", "Nama / Keterangan", "Jenis", "Kategori", "Nominal"]],
        body: allTx.map((tx, i) => [i + 1, fmtTglLong(tx.tanggal), tx.nama || "—", tx.jenis, tx.kategori, fmt(tx.nominal)]),
        headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: [2, 3, 2, 3] },
        alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 30 },
          2: { cellWidth: "auto" },
          3: { cellWidth: 24 },
          4: { cellWidth: 26 },
          5: { cellWidth: 36, halign: "right" },
        },
        didParseCell(hookData) {
          if (hookData.section === "body" && hookData.column.index === 3) {
            const val = hookData.cell.raw as string
            hookData.cell.styles.fontStyle = "bold"
            hookData.cell.styles.textColor = val === "Penerimaan" ? GREEN : RED
          }
        },
      })

      // ── Footer tiap halaman ─────────────────────────────────
      const pageCount = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...GRAY)
        doc.text(
          `Halaman ${i} dari ${pageCount}  |  Yayasan Amanah Falah`,
          W / 2, doc.internal.pageSize.getHeight() - 6, { align: "center" },
        )
      }

      doc.save(`laporan-amanahfalah-${dari || "semua"}-sd-${sampai || "semua"}.pdf`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat PDF")
    } finally {
      setExporting(null)
    }
  }

  // ── Export Excel ────────────────────────────────────────────
  async function handleExportExcel() {
    setExporting("excel")
    try {
      const d = data ?? await fetchData()
      if (!d) { setExporting(null); return }

      const XLSX = await import("xlsx")
      const wb   = XLSX.utils.book_new()

      // Sheet 1 — Ringkasan
      const rows: (string | number)[][] = [
        ["YAYASAN AMANAH FALAH"],
        ["LAPORAN PENERIMAAN DAN PENGELUARAN KAS"],
        [`Periode: ${periodeLabel(dari, sampai)}`],
        [],
      ]
      if (jenis !== "pengeluaran") {
        rows.push(["", "I. PENERIMAAN", ""])
        d.summary.ringkasanPenerimaan.forEach((r, i) => rows.push([`   ${i + 1}.`, r.kategori, r.total]))
        rows.push(["", "Total Penerimaan", d.summary.totalPenerimaan])
        rows.push([])
      }
      if (jenis !== "penerimaan") {
        rows.push(["", "II. PENGELUARAN", ""])
        d.summary.ringkasanPengeluaran.forEach((r, i) => rows.push([`   ${i + 1}.`, r.kategori, r.total]))
        rows.push(["", "Total Pengeluaran", d.summary.totalPengeluaran])
        rows.push([])
      }
      if (jenis === "semua") rows.push(["", "SALDO AKHIR", d.summary.saldoAkhir])

      const ws1 = XLSX.utils.aoa_to_sheet(rows)
      ws1["!cols"] = [{ wch: 6 }, { wch: 30 }, { wch: 22 }]
      XLSX.utils.book_append_sheet(wb, ws1, "Ringkasan")

      // Sheet 2 — Detail
      const header = ["No", "Tanggal", "Nama", "Jenis", "Kategori", "Rincian", "Nominal"]
      const detail: (string | number)[][] = [
        ...d.donasi.map((tx, i) => [
          i + 1, fmtTgl(tx.tanggal), tx.nama, "Penerimaan", tx.sumber, tx.rincian ?? "-", tx.nominal,
        ]),
        ...d.pengeluaran.map((tx, i) => [
          d.donasi.length + i + 1, fmtTgl(tx.tanggal), tx.nama, "Pengeluaran", tx.kategori, tx.rincian ?? "-", tx.nominal,
        ]),
      ].sort((a, b) => String(a[1]).localeCompare(String(b[1])))

      const ws2 = XLSX.utils.aoa_to_sheet([header, ...detail])
      ws2["!cols"] = [{ wch: 6 }, { wch: 22 }, { wch: 28 }, { wch: 14 }, { wch: 16 }, { wch: 22 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, ws2, "Detail Transaksi")

      XLSX.writeFile(wb, `laporan-amanahfalah-${dari || "semua"}-sd-${sampai || "semua"}.xlsx`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat Excel")
    } finally {
      setExporting(null)
    }
  }

  // ─── Render ────────────────────────────────────────────────
  const totalTx = (data?.donasi.length ?? 0) + (data?.pengeluaran.length ?? 0)

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <div className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-gray-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Laporan Falah</h1>
      </div>

      <div className="flex-1 px-4 md:px-8 py-4 md:py-6 space-y-5">

        {/* ── Form Card ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-5">Export Data Laporan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Dari</label>
              <input
                type="date"
                value={dari}
                onChange={(e) => setDari(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037EBD]/30 focus:border-[#037EBD]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Sampai</label>
              <input
                type="date"
                value={sampai}
                onChange={(e) => setSampai(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037EBD]/30 focus:border-[#037EBD]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Transaksi</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value as Jenis)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037EBD]/30 focus:border-[#037EBD] bg-white"
            >
              <option value="semua">Semua Transaksi</option>
              <option value="penerimaan">Penerimaan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleExportPDF}
              disabled={!!exporting || loading || !!error}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {exporting === "pdf" ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              EXPORT PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={!!exporting || loading || !!error}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {exporting === "excel" ? <Loader2 size={15} className="animate-spin" /> : <Table2 size={15} />}
              EXPORT EXCEL
            </button>
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Gagal memuat data</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => fetchData()}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-medium"
            >
              <RefreshCw size={13} /> Coba lagi
            </button>
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────────── */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center gap-3">
            <Loader2 size={20} className="animate-spin text-[#037EBD]" />
            <span className="text-gray-500 text-sm">Memuat data laporan...</span>
          </div>
        )}

        {/* ── Preview ─────────────────────────────────────────── */}
        {data && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Ringkasan Laporan</h3>
              <span className="text-xs text-gray-400">{totalTx} transaksi</span>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {jenis !== "pengeluaran" && (
                <div className="px-5 md:px-6 py-4">
                  <p className="text-xs text-gray-500 mb-1">Total Penerimaan</p>
                  <p className="text-lg font-bold text-green-600">{fmt(data.summary.totalPenerimaan)}</p>
                </div>
              )}
              {jenis !== "penerimaan" && (
                <div className="px-5 md:px-6 py-4">
                  <p className="text-xs text-gray-500 mb-1">Total Pengeluaran</p>
                  <p className="text-lg font-bold text-red-600">{fmt(data.summary.totalPengeluaran)}</p>
                </div>
              )}
              {jenis === "semua" && (
                <div className="px-5 md:px-6 py-4">
                  <p className="text-xs text-gray-500 mb-1">Saldo Akhir</p>
                  <p className={`text-lg font-bold ${data.summary.saldoAkhir >= 0 ? "text-[#037EBD]" : "text-red-600"}`}>
                    {fmt(data.summary.saldoAkhir)}
                  </p>
                </div>
              )}
            </div>

            {/* Breakdown per kategori */}
            <div className="px-5 md:px-6 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {jenis !== "pengeluaran" && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Rincian Penerimaan</p>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-50">
                        {data.summary.ringkasanPenerimaan.map((r) => (
                          <tr key={r.kategori}>
                            <td className="py-1.5 text-gray-600">{r.kategori}</td>
                            <td className="py-1.5 text-right font-medium text-gray-800">{fmt(r.total)}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-200">
                          <td className="pt-2 font-bold text-gray-900">Total</td>
                          <td className="pt-2 text-right font-bold text-green-600">{fmt(data.summary.totalPenerimaan)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                {jenis !== "penerimaan" && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Rincian Pengeluaran</p>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-50">
                        {data.summary.ringkasanPengeluaran.map((r) => (
                          <tr key={r.kategori}>
                            <td className="py-1.5 text-gray-600">{r.kategori}</td>
                            <td className="py-1.5 text-right font-medium text-gray-800">{fmt(r.total)}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-200">
                          <td className="pt-2 font-bold text-gray-900">Total</td>
                          <td className="pt-2 text-right font-bold text-red-600">{fmt(data.summary.totalPengeluaran)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Daftar transaksi terbaru */}
            {totalTx > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-5 md:px-6 py-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Detail Transaksi ({totalTx} entri)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-gray-100 text-left">
                        <th className="px-5 py-2 font-medium">Tanggal</th>
                        <th className="px-3 py-2 font-medium">Nama</th>
                        <th className="px-3 py-2 font-medium">Kategori</th>
                        <th className="px-3 py-2 font-medium">Jenis</th>
                        <th className="px-3 py-2 font-medium text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        ...data.donasi.map((tx) => ({ ...tx, jenis: "Penerimaan" as const, kategori: tx.sumber })),
                        ...data.pengeluaran.map((tx) => ({ ...tx, jenis: "Pengeluaran" as const })),
                      ]
                        .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                        .map((tx, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-5 py-2 text-gray-500 whitespace-nowrap">{fmtTgl(tx.tanggal)}</td>
                            <td className="px-3 py-2 text-gray-800 font-medium truncate max-w-[140px]">{tx.nama || "—"}</td>
                            <td className="px-3 py-2 text-gray-500">{tx.kategori}</td>
                            <td className="px-3 py-2">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                tx.jenis === "Penerimaan"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}>
                                {tx.jenis}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">
                              {fmt(tx.nominal)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {totalTx === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
                Tidak ada transaksi dalam periode ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
