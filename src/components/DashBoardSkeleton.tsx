import React from 'react'

const DashBoardSkeleton = () => {
  return (
    <section className="animate-pulse bg-slate-800 min-h-screen">
    <div className="text-white">
      <nav className="flex justify-between p-4 gap-4 items-center bg-slate-900">
        
      </nav>
    </div>
    <div className="p-4">
      <p className=" bg-slate-950 rounded p-2">
      </p>
      <div className="flex  flex-col sm:flex-row gap-4 min-h-full my-4">
        <div className="w-full sm:w-1/5 flex  flex-col  rounded ">
          
        </div>
        <div className="w-full h-fit bg-slate-950 p-4 rounded">
          
        </div>
      </div>
    </div>
  </section>
  )
}

export default DashBoardSkeleton