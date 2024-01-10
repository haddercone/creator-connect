import { serverSession } from "@/app/auth/serverSession";
import { Session } from "next-auth";
import Link from "next/link";

const Header = async () => {
    const session : Session | null = await serverSession();

  return (
    <header className="flex justify-between items-center p-4 border-b-[1px]">
        <p className="text-2xl leading-6 ">Creator Connect</p>

        {session ? (
          <div className="flex gap-4 justify-center items-center">
            <p>{session.user.name}</p>
            <img className="w-10 h-10 rounded-full" src={session.user.image as string}  alt="user_img" />
            <Link 
          href={"api/auth/signout"}
          className="bg-slate-900 border-2 border-transparent hover:text-black hover:bg-white hover:border-2 hover:border-slate-900 duration-200 rounded px-4 py-2 text-white"
          >Log Out</Link>
          </div>
        ) : (
          <Link
            href={"api/auth/signin"}
            className="bg-slate-900 border-2 border-transparent hover:text-black hover:bg-white hover:border-2 hover:border-slate-900 duration-200 rounded px-4 py-2 text-white"
          >
            Log In
          </Link>
        )}
      </header>
  )
}

export default Header