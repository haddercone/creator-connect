import { useServerSession } from "@/hooks";
import { redirect } from "next/navigation";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await useServerSession()

    if(!session) {
      redirect("/")
    }

  return <>
    {children}
  </>;
}
