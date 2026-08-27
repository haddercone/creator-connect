import { redirect } from "next/navigation";
import { LogoutButton, Questions } from "@/components";
import { useServerSession } from "@/hooks";
import { RiArrowRightSLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";

const DashBoard = async () => {
  const session = await useServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    session?.user && (
      <section className="min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#292d36] bg-[#111318] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <Image
                src={session.user.image as string}
                width={52}
                height={52}
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#3a404c]"
                alt={session.user.name as string}
              />
              <div className="min-w-0">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">
                  Your workspace
                </p>
                <h1 className="truncate text-2xl font-bold tracking-[-0.03em] text-[#f4f3ef] sm:text-3xl">
                  {session.user.name}
                </h1>
                <p className="truncate text-sm text-[#858b98]">
                  @{session.user.username}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-full flex-col gap-3 sm:w-1/4">
              <div>
                <Link
                  href={session.user?.username}
                  target="_blank"
                  className="flex w-full items-center justify-between rounded-xl border border-[#292d36] bg-[#111318] p-4 hover:border-[#d8f36b66]"
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
                    className="flex w-full items-center justify-between rounded-xl border border-[#292d36] bg-[#111318] p-4 hover:border-[#d8f36b66]"
                  >
                    <span>Admin dashboard</span>
                    <RiArrowRightSLine />
                  </Link>
                )}
              </div>
            </div>
            <div className="h-fit w-full rounded-2xl border border-[#292d36] bg-[#111318] p-4">
              <Questions email={session.user.email as string} />
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default DashBoard;