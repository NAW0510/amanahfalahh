export default function TransaksiLoading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
