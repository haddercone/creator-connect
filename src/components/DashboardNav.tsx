"use client";

import { LogoutButton } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiCloseLine, RiExternalLinkLine, RiMenuLine } from "react-icons/ri";

type DashboardNavProps = {
  user: {
    name: string;
    username: string;
    image: string;
    role?: string;
  };
};

const DashboardNav = ({ user }: DashboardNavProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const panelContent = (
    <>
      <div className="flex items-center gap-3 border-b border-[#292d36] pb-4">
        <Image
          src={user.image}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#3a404c]"
          alt={user.name}
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold tracking-[-0.02em] text-[#f4f3ef]">
            {user.name}
          </p>
          <p className="truncate text-sm text-[#858b98]">@{user.username}</p>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        <Link
          href={user.username}
          target="_blank"
          onClick={() => setOpen(false)}
          className="group flex items-center justify-between rounded-xl border border-[#292d36] bg-[#0a0b0d] p-3.5 transition-colors hover:border-[#d8f36b66]"
        >
          <span className="text-sm font-medium text-[#f4f3ef]">
            Your question card
          </span>
          <RiExternalLinkLine className="h-4 w-4 shrink-0 text-[#858b98] transition-colors group-hover:text-[#d8f36b]" />
        </Link>
        {user.role === "admin" && (
          <Link
            href="/dashboard/admin"
            target="_blank"
            onClick={() => setOpen(false)}
            className="group flex items-center justify-between rounded-xl border border-[#292d36] bg-[#0a0b0d] p-3.5 transition-colors hover:border-[#d8f36b66]"
          >
            <span className="text-sm font-medium text-[#f4f3ef]">
              Admin dashboard
            </span>
            <RiExternalLinkLine className="h-4 w-4 shrink-0 text-[#858b98] transition-colors group-hover:text-[#d8f36b]" />
          </Link>
        )}
      </nav>

      <div className="mt-auto pt-4">
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#292d36] bg-[#111318] p-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={user.image}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#3a404c]"
            alt={user.name}
          />
          <p className="truncate text-sm font-semibold text-[#f4f3ef]">
            {user.name}
          </p>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-[#f4f3ef] transition-colors hover:bg-[#F1F1F11F]"
        >
          <RiMenuLine className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#0a0b0de6] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col rounded-r-2xl border-r border-[#292d36] bg-[#111318] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-4 self-end rounded-lg p-2 text-[#858b98] transition-colors hover:bg-[#F1F1F11F] hover:text-[#f4f3ef]"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
            {panelContent}
          </div>
        </div>
      )}

      <aside className="hidden w-full shrink-0 flex-col rounded-2xl border border-[#292d36] bg-[#111318] p-4 sm:p-5 lg:flex lg:w-72">
        {panelContent}
      </aside>
    </>
  );
};

export default DashboardNav;