import React from 'react'

const CreatorPageSkeleton = () => {
  return (
    <section className="flex min-h-screen gap-10 justify-center items-center md:p-5 md:items-start md:flex-row flex-col bg-gray-900 text-white py-8">
      <div className="bg-[#00000039] lg:w-1/3 md:w-1/2 p-4 rounded">
        <div className="flex gap-5 flex-col justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-slate-700 animate-pulse"></div>
          <div className="h-8 w-48 bg-slate-700 animate-pulse rounded"></div>
        </div>
        <div className="flex justify-center items-center flex-col gap-5 mt-5">
          <div className="h-4 w-40 bg-slate-700 animate-pulse rounded"></div>
          <div className="w-full bg-slate-800 animate-pulse rounded h-10"></div>
        </div>
      </div>
      <div className="md:w-1/2 bg-[#00000039] rounded">
        <div className="px-4 text-2xl bg-slate-600 py-2 rounded-t-sm flex items-center gap-2">
          <div className="h-6 w-48 bg-slate-500 animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-slate-500 animate-pulse rounded"></div>
        </div>
        <div className="flex px-4 mt-4 gap-5 flex-col pb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border border-slate-600 p-2 rounded">
              <div className="h-4 w-full bg-slate-700 animate-pulse rounded mb-3"></div>
              <div className="h-3 w-3/4 bg-slate-700 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CreatorPageSkeleton
