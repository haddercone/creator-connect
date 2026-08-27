import Link from "next/link";
import { useServerSession } from "@/hooks";
import Image from "next/image";

const Header = async () => {
  const session = await useServerSession();
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-5 py-4 border-b border-[#292d36] bg-[#0a0b0de8] backdrop-blur-xl">
      <Link href="/" className="leading-6 flex items-center gap-3 font-semibold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d8f36b] text-[#171b0a] font-black">C</span>
        <span>creator connect<span className="text-[#d8f36b]">.</span></span>
      </Link>
      {session ? (
        <div className="flex items-center gap-3">
          <Link className="hidden sm:block text-sm text-[#858b98] hover:text-white" href={"/dashboard"}>Dashboard</Link>
          <Link href={"/dashboard"} aria-label="Open dashboard">
            <Image className="rounded-full ring-2 ring-[#292d36]" alt={session.user.name as string} src={session.user.image as string} width={36} height={36} />
          </Link>
        </div>
      ) : (
        <Link
          href={"/api/auth/signin"}
          className="rounded-lg border border-[#3a404c] px-4 py-2 text-sm font-medium text-white hover:border-[#d8f36b] hover:text-[#d8f36b]"
        >
          Log in
        </Link>
      )}
    </header>
  );
};

export default Header;
