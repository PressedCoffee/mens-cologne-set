export default function LoadingProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-gray-700"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
