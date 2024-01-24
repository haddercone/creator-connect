import React from 'react'

const DashBoardSkeleton = () => {
  return (
    <>
      <div className='h-10 bg-slate-700 animate-pulse mb-2 '></div>
      <div className='h-10 bg-slate-700 animate-pulse my-2'></div>
      <div className='bg-slate-600 flex w-full gap-4 m-4 h-[90vh] animate-pulse'>
        <div className='h-full bg-slate-800 w-1/6'></div>
        <div className='w-11/12 h-full bg-slate-800'></div>
      </div>
    </>
  )
}

export default DashBoardSkeleton