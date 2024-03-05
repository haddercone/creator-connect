import React from 'react'

const Loader = () => {
    return (
        <div className='min-h-screen'>
          <div className='h-20 animate-pulse bg-slate-400'></div>
          <div className='lg:w-2/3 mx-auto my-2 bg-slate-700'>
            <div className='flex min-h-16 flex-col lg:items-center  gap-2 lg:flex-row md:justify-between items-start p-2 '>
              <div className='h-10 w-36 bg-slate-400 animate-pulse rounded'></div>
              <div className='h-10 w-full lg:w-1/2 bg-slate-400 animate-pulse rounded'></div>
            </div>
            <div className='flex my-4 flex-wrap px-2 pb-2 gap-2'>
              {Array.from({length: 10}).map((_, index) => {
                return <div key={index} className=' rounded-md lg:w-[49.4%] w-full p-2 flex animate-pulse bg-slate-800 gap-4 justify-start items-center'>
                  <div className='w-28 h-28 rounded-full bg-slate-400 animate-pulse'></div>
                  <div>
                    <div className='h-4 my-2 w-52 bg-slate-400 animate-pulse'></div>
                    <div className='h-2 w-24 bg-slate-400 animate-pulse'></div>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
      );
}

export default Loader