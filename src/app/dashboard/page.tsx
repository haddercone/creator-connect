"use client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { MdOutlineInsertLink } from "react-icons/md";
import {LogoutButton, DashBoardSkeleton, Questions} from "@/components/index"
import React, { useState } from "react";
import { useClickOutside, useClientSession } from "@/hooks/index";
import { RiArrowRightSLine } from "react-icons/ri";
import { signOut } from "next-auth/react";
import Link from "next/link";

const DashBoard = () => {
  const session = useClientSession();
  const [open, setOpen] = useState(false);
  const { data, status } = session;
  
  function handleMenuClick() {
    setOpen(!open);
  }
  const ref = useClickOutside(handleMenuClick);

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (status == "loading") {
    return <DashBoardSkeleton />;
  }

  return (
    data?.user && (
      <section className="bg-slate-800 min-h-screen">
        {open && (
          <aside
            ref={ref}
            className={`fixed  bottom-0  top-0 left-0 flex flex-col justify-between bg-slate-900 p-4  text-white ${
              open ? "animate-openmenu" : "animate-closemenu"
            }`}
          >
            <div className="flex justify-around items-center gap-3 rounded bg-[#FFFFFF39] px-4 py-2 flex-wrap container">
              <Image
                className="w-14 h-14 rounded-full"
                src={data?.user.image as string}
                width={200}
                height={200}
                alt="user_img"
              />
              {data?.user.name}
            </div>
            <LogoutButton />
          </aside>
        )}

        <div className="text-white">
          <nav className="flex justify-between p-4 gap-4 items-center bg-slate-900">
            <div className="flex gap-4">
              <button onClick={handleMenuClick}>
                <CiMenuBurger />
              </button>
              <p>
                Creator connect / <span className="font-bold">Dashboard</span>
              </p>
            </div>
            <button onClick={() => signOut()}>Log Out</button>
          </nav>
        </div>
        <div className="p-4">
          <div className="flex gap-2 flex-wrap bg-slate-950 rounded p-2">
            <p className="text-2xl">{data?.user.name}&apos;s dashboard</p>
            <Link target="_blank" className="text-slate-400 flex justify-start hover:underline items-center gap-2" href={data.user?.username}>your question card <MdOutlineInsertLink/></Link>
          </div>
          <div className="flex  flex-col sm:flex-row gap-4 min-h-full my-4">
            <div className="w-full sm:w-1/5 flex  flex-col  rounded ">
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full rounded-t  py-2">
                All questions
                <RiArrowRightSLine />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full border border-transparent border-t-slate-700 border-b-slate-700 py-2">
                All questions
                <RiArrowRightSLine />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full rounded-b  py-2">
                All questions
                <RiArrowRightSLine />
              </button>
            </div>
            <div className="w-full h-fit bg-slate-900 p-4 rounded">
              <Questions email={data.user.email as string} />
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default DashBoard;
