import { redirect } from "next/navigation";
import { DashboardNav, Questions } from "@/components";
import { useServerSession } from "@/hooks";

const DashBoard = async () => {
  const session = await useServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    session?.user && (
      <section className="min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row">
          <DashboardNav
            user={{
              name: session.user.name as string,
              username: session.user.username as string,
              image: session.user.image as string,
              role: session.user.role,
            }}
          />

          <div className="h-fit w-full rounded-2xl border border-[#292d36] bg-[#111318] p-4">
            <Questions email={session.user.email as string} />
          </div>
        </div>
      </section>
    )
  );
};

export default DashBoard;