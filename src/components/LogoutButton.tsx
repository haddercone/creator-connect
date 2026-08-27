"use client"

import { signOut } from "next-auth/react";
import { RiLogoutBoxRLine } from "react-icons/ri";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({redirect: true})}
      className="inline-flex items-center gap-2 rounded-lg border border-[#3a404c] px-3.5 py-2 text-sm font-medium text-[#f4f3ef] transition-colors hover:border-[#f87171] hover:bg-[#f871710d] hover:text-[#f87171]"
    >
      <RiLogoutBoxRLine className="h-4 w-4" />
      Log out
    </button>
  )
}

export default LogoutButton;