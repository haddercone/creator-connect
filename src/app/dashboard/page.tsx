import Image from "next/image";
import { redirect } from "next/navigation";
import { LogoutButton, Questions } from "@/components";
import { useServerSession } from "@/hooks";
import { RiArrowRightSLine } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

const DashBoard = async () => {
  const session = await useServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    session?.user && (
      <section className="bg-slate-800 min-h-screen">
        <div className="p-4">
          <div className="flex justify-between items-center bg-slate-950 rounded p-2">
            <div className="flex items-center gap-2">
              <Link className="" href={"/"}><BsArrowLeft /></Link>
              <p className="font-bold">{session.user.name} <span className="text-normal text-slate-500">{session.user.role === "admin" ? "(admin)": null}</span></p>
            </div>
            <div className="flex  items-center gap-2 rounded-full">
              <LogoutButton />
              <div className="bg-[#F1F1F11F] p-1 rounded-full">
                <Image
                  className="rounded-full"
                  src={session.user.image as string}
                  alt={session.user.name as string}
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
          <div className="flex  flex-col sm:flex-row gap-4 min-h-full my-4">
            <div className="w-full sm:w-1/4 flex gap-4 flex-col  rounded ">
              <div>
                <Link
                  href={session.user?.username}
                  target="_blank"
                  className="flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-900 transition w-full rounded  py-2"
                >
                  <span>Your question card</span>
                  <RiArrowRightSLine />
                </Link>
              </div>
              <div>
                {session.user.role === "admin" && (
                  <Link
                    href="/dashboard/admin"
                    target="_blank"
                    className="flex items-center justify-between p-2 bg-slate-900 hover:bg-slate-700 transition w-full rounded  py-2"
                  >
                    <span>Admin dashboard</span>
                    <RiArrowRightSLine />
                  </Link>
                )}
              </div>
            </div>
            <div className="w-full h-fit bg-slate-900 p-4 rounded">
              <Questions email={session.user.email as string} />
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default DashBoard;
