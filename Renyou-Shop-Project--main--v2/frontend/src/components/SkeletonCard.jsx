export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-9 bg-gray-100 rounded-xl w-full mt-1" />
      </div>
    </div>
  )
}
