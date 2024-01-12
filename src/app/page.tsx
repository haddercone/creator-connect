import { redirect } from "next/navigation";
import { serverSession } from "./auth/serverSession";
import Header from "@/components/Header";
export default async function Home() {
  const session = await serverSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main>
      <Header />
      <section className="relative m-2 md:m-0 min-h-[90vh] flex justify-center items-center flex-col gap-10 text-center">
        <h1 className="md:text-6xl text-4xl font-bold">Connect With your favourite creators </h1>
        <p className="text-2xl">Ask question to your favourite creators</p>
        <button className=" relative px-4 py-2 border-2 border-slate-900 shadow-sm  rounded bg-slate-900  duration-200">Find Creators</button>
      </section>
    </main>
  );
}
