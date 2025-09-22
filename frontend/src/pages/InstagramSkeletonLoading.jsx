import React from 'react';

const InstagramSkeletonLoading = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stories Skeleton */}
      <div className="flex space-x-3 p-4 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Posts Skeleton */}
      <div className="space-y-0">
        {[...Array(3)].map((_, postIndex) => (
          <div key={postIndex} className="bg-white">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Post Image */}
            <div className="w-full h-80 bg-gray-200 animate-pulse"></div>

            {/* Post Actions */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Post Content */}
            <div className="px-3 pb-3 space-y-2">
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-1">
                <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100">
        <div className="flex items-center justify-around py-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramSkeletonLoading

// // Alternative version with more realistic shimmer effect
// const InstagramSkeletonLoadingShimmer = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white min-h-screen">
//       <style jsx>{`
//         .shimmer {
//           background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//           background-size: 200% 100%;
//           animation: shimmer 1.5s infinite;
//         }
        
//         @keyframes shimmer {
//           0% {
//             background-position: -200% 0;
//           }
//           100% {
//             background-position: 200% 0;
//           }
//         }
//       `}</style>

//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-100">
//         <div className="w-24 h-6 shimmer rounded"></div>
//         <div className="flex space-x-4">
//           <div className="w-6 h-6 shimmer rounded"></div>
//           <div className="w-6 h-6 shimmer rounded"></div>
//         </div>
//       </div>

//       {/* Stories */}
//       <div className="flex space-x-3 p-4 overflow-x-auto">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0">
//             <div className="w-16 h-16 shimmer rounded-full"></div>
//             <div className="w-12 h-3 shimmer rounded"></div>
//           </div>
//         ))}
//       </div>

//       {/* Posts */}
//       {[...Array(3)].map((_, postIndex) => (
//         <div key={postIndex} className="bg-white mb-4">
//           {/* Post Header */}
//           <div className="flex items-center justify-between p-3">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 shimmer rounded-full"></div>
//               <div className="space-y-2">
//                 <div className="w-20 h-3 shimmer rounded"></div>
//                 <div className="w-16 h-2 shimmer rounded"></div>
//               </div>
//             </div>
//             <div className="w-6 h-6 shimmer rounded"></div>
//           </div>

//           {/* Post Image */}
//           <div className="w-full h-80 shimmer"></div>

//           {/* Post Actions */}
//           <div className="flex items-center justify-between p-3">
//             <div className="flex items-center space-x-4">
//               <div className="w-6 h-6 shimmer rounded"></div>
//               <div className="w-6 h-6 shimmer rounded"></div>
//               <div className="w-6 h-6 shimmer rounded"></div>
//             </div>
//             <div className="w-6 h-6 shimmer rounded"></div>
//           </div>

//           {/* Post Content */}
//           <div className="px-3 pb-3 space-y-2">
//             <div className="w-24 h-3 shimmer rounded"></div>
//             <div className="space-y-1">
//               <div className="w-full h-3 shimmer rounded"></div>
//               <div className="w-3/4 h-3 shimmer rounded"></div>
//             </div>
//             <div className="w-20 h-3 shimmer rounded"></div>
//             <div className="flex items-center space-x-2 mt-2">
//               <div className="w-6 h-6 shimmer rounded-full"></div>
//               <div className="w-32 h-3 shimmer rounded"></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Usage component to show both versions
// const SkeletonDemo = () => {
//   const [version, setVersion] = React.useState('pulse');

//   return (
//     <div className="w-full">
//       <div className="flex justify-center space-x-4 mb-4 p-4">
//         <button 
//           onClick={() => setVersion('pulse')}
//           className={`px-4 py-2 rounded ${version === 'pulse' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//         >
//           Pulse Effect
//         </button>
//         <button 
//           onClick={() => setVersion('shimmer')}
//           className={`px-4 py-2 rounded ${version === 'shimmer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//         >
//           Shimmer Effect
//         </button>
//       </div>
      
//       {version === 'pulse' ? <InstagramSkeletonLoading /> : <InstagramSkeletonLoadingShimmer />}
//     </div>
//   );
// };

// export default SkeletonDemo;