export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-400">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    </div>
  );
}
