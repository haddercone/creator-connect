import React from 'react'

const DashBoardSkeleton = () => {
  return (
    <>
      <div className='h-20 bg-slate-700 animate-pulse m-2'></div>
      <div className='bg-slate-900 flex gap-4 m-2 h-[80vh] animate-pulse'>
        <div className='md:h-full h-40 md:w-1/6 bg-slate-800'></div>
        <div className='md:h-full h-80 md:w-10/12 bg-slate-800'></div>
      </div>
    </>
  )
}

export default DashBoardSkeleton