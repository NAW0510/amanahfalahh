export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 px-8 py-6">
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse shadow-sm">
              <div className="w-10 h-10 bg-gray-200 rounded-full mb-4" />
              <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
