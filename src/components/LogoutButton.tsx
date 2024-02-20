"use client"

import { signOut } from "next-auth/react";

const LogoutButton = () => { 
  return (
    <button
      onClick={() => signOut({redirect: true})}
      className="hover:bg-[#F1F1F11F] rounded p-2">
        Log out
    </button>
  )
}

export default LogoutButton;