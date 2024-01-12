"use client";

import { redirect } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { clientSession } from "../auth/clientSession";
import LogoutButton from "@/components/LogoutButton";
import React, { useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { signOut } from "next-auth/react";

const DashBoard = () => {
  const session = clientSession();
  const [open, setOpen] = useState(false);
  const { data, status } = session;

  function handleMenuClick() {
    setOpen(!open);
  }

  if(status === "unauthenticated") {
    redirect("/")
  }

  const ref = useClickOutside(handleMenuClick);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <section className=" bg-slate-800 min-h-screen">
      {open && (
        <aside
          ref={ref}
          className={`fixed  bottom-0  top-0 left-0 flex flex-col justify-between bg-slate-900 p-4  text-white ${open ? "animate-openmenu": "animate-closemenu"}`}
        >
          <div className="flex justify-around items-center gap-3 rounded bg-[#FFFFFF39] px-4 py-2 flex-wrap container">
            <img
              className="w-14 h-14 rounded-full"
              src={data?.user.image as string}
              alt=""
            />
            {data?.user.name}
          </div>
          <LogoutButton />
        </aside>
      )}

      <div className="text-white">
        <nav className="flex justify-between p-4 gap-4 items-center bg-slate-900">
        <div className="flex gap-4">
        <button className="" onClick={handleMenuClick}>
          <CiMenuBurger />
        </button>
        <p>Creator connect / <span className="font-bold">Dashboard</span></p>
        </div>
        <button onClick={() => signOut({redirect:true})}>Log Out</button>
        </nav>
        
      </div>
      <div className="p-4">
        <p className="text-2xl bg-slate-950 rounded p-2">{data?.user.name}'s dashboard</p>
        <div className="flex  flex-col sm:flex-row gap-4 min-h-full my-4">
          <div className="w-full sm:w-1/5 flex gap-4 flex-col bg-slate-900 p-4 rounded">
            <button className="bg-black w-full rounded py-2">All questions</button>
            <button className="bg-black w-full rounded py-2">Answered questions</button>
            <button className="bg-black w-full rounded py-2">Deleted questions</button>
          </div>
          <div className="w-full">
            data  
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
