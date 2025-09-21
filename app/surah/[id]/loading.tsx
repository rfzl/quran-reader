// ini filenya app/surah/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}