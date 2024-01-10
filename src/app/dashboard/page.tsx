import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { serverSession } from "../auth/serverSession";

const DashBoard = async () => {
  const session = await serverSession()
  
  if (!session) {
    redirect("/");
  }
  return (
    <section className="">
      {/* <Header /> */}
      <p>Dashboard</p>
      <Link href={"api/auth/signout"}>Log Out</Link>
    </section>
  );
};

export default DashBoard;
