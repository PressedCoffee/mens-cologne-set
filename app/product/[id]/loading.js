export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="relative aspect-square bg-gray-800/50 rounded-lg animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-800/50 rounded-lg w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-800/50 rounded-lg w-1/4 animate-pulse" />
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-gray-800/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-800/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-800/50 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
