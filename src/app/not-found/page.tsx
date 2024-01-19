"use client";

import Link from 'next/link'
import { RiArrowGoBackFill } from "react-icons/ri";

const NotFound = () => {
  return (
    <div className='min-h-screen flex justify-center items-center flex-col gap-5'>
        <div className='flex justify-center items-center gap-5'>
            <p className='text-2xl border border-transparent border-r-slate-400 px-5'>404</p>
            <p className='text-slate-400'>This page could not be found</p>
        </div>
        <Link onClick={() => window.history.back()} className='px-2 py-1 hover:bg-slate-800 duration-200 hover:text-slate-400 flex justify-center items-center gap-2' href={"/"}>
            <span><RiArrowGoBackFill /></span>
            <span>Go back</span>
        </Link>
    </div>
  )
}

export default NotFound