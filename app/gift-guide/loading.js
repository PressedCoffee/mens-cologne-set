export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-800 rounded-lg w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto"></div>
            </div>
  
            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }