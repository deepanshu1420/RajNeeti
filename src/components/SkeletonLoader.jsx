const SkeletonLoader = () => {
  // We create an array of 6 items to show 6 dummy cards while loading
  const skeletonCards = Array(6).fill(0);

  return (
    <div className="w-full">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8 animate-pulse"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards.map((_, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Text Placeholders */}
            <div className="p-5 flex flex-col gap-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;