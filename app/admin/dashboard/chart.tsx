"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"

interface Props {
  data: { bulan: string; penerimaan: number; pengeluaran: number }[]
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "penerimaan" ? "Penerimaan" : "Pengeluaran"}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function DashboardChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={14} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
          formatter={(v) => v === "penerimaan" ? "Penerimaan" : "Pengeluaran"}
        />
        <Bar dataKey="penerimaan" fill="#037EBD" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pengeluaran" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
