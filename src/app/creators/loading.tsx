import React from 'react'

const Loader = () => {
    return (
        <div className="flex grow lg:w-1/2 max-w-96 overflow-ellipsis lg:grow-0 items-center gap-4 px-4 py-2  border border-slate-800 animate-pulse">
          <div className="rounded-full bg-gray-300" style={{ width: 80, height: 80 }}></div>
          <div>
            <div className="w-24 h-4 bg-gray-300 mb-2"></div>
            <div className="w-16 h-3 bg-gray-300"></div>
          </div>
        </div>
      );
}

export default Loader