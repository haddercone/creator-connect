import Link from "next/link";
import { useServerSession } from "@/hooks";
const Header = async () => {
  const session = await useServerSession();
  return (
    <header className="flex justify-between items-center px-4 py-2 border-b-[1px] border-b-slate-600">
      <Link href="/" className="text-2xl leading-6 ">
        Creator Connect
      </Link>
      {session ? (
        <div className="py-2">
          <p>{session.user.name}</p>
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
