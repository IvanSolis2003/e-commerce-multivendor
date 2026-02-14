export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-64 bg-gray-300"></div>
      
      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="h-16 bg-gray-300 rounded"></div>
        <div className="h-16 bg-gray-300 rounded"></div>
        <div className="h-16 bg-gray-300 rounded"></div>
        <div className="h-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}