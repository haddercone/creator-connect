"use client"

import { signOut } from "next-auth/react";

const LogoutButton = () => { 
  return (
    <button
      onClick={() => signOut({redirect: true})}
      className="bg-white rounded  text-black px-4 py-2 w-full">
        Log out
    </button>
  )
}

export default LogoutButton;