import Link from "next/link";
import { useServerSession } from "@/hooks";
import Image from "next/image";

const Header = async () => {
  const session = await useServerSession();
  return (
    <header className="flex justify-between items-center px-4 py-2 border-b-[1px] border-b-slate-600">
      <Link href="/" className="leading-6 flex items-center gap-2">
        <Image src={"/hero-icon.svg"} alt="hero-icon" width={20} height={20}/>
        <span>Creator connect</span>
      </Link>
      {session ? (
        <div className="py-2 flex items-center gap-4">
          <Link href={"/dashboard"}>{session.user.name}</Link>
          <Image className="rounded-full" alt={session.user.name as string} src={session.user.image as string} width={40} height={40} />
        </div>
      ) : (
        <Link
          href={"/api/auth/signin"}
          className="bg-slate-900 border-2 border-transparent hover:text-black hover:bg-white hover:border-2 hover:border-slate-900 duration-200 rounded px-4 py-2 text-white"
        >
          Log In
        </Link>
      )}
    </header>
  );
};

export default Header;
