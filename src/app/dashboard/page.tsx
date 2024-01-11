import Header from "@/components/Header";
import { redirect } from "next/navigation";
// import Link from "next/link";
import { serverSession } from "../auth/serverSession";
import LogoutButton from "@/components/LogoutButton";

const DashBoard = async () => {
  const session = await serverSession()
  
  if (!session) {
    redirect("/");
  }

  return (
    <section className="flex gap-4 bg-slate-800 min-h-screen">
      {/* <Header /> */}
      
      <aside className="w-1/6">
      <div className="w-1/6 fixed bottom-0 top-0 left-0 flex flex-col justify-between bg-slate-900 p-4  text-white">
          <div className="flex justify-around items-center gap-3 rounded bg-[#FFFFFF39] px-4 py-2">
            <img className="w-14 h-14 rounded-full" src={session.user.image as string} alt="" />
            {session.user.name}
          </div>
          <LogoutButton />
        </div>
      </aside>
      <div className="grow w-1/2">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam hic corrupti facere nam, error cumque cupiditate necessitatibus non fugit laudantium cum laborum numquam? Dicta dignissimos cum doloribus officiis vero odit repudiandae illum mollitia id eligendi quia dolore ullam ab libero corporis amet magni rem dolorum, architecto sit fugit dolor fugiat! Ipsum sint doloremque aliquid sit quasi libero perspiciatis eveniet aliquam delectus architecto et, quae rem iure numquam culpa voluptatum dolore laudantium cumque repellendus odit sunt repudiandae blanditiis nostrum. Doloribus error distinctio at cum doloremque molestias eos ratione eligendi animi atque dignissimos, blanditiis beatae eum, sint pariatur qui, ab ducimus illum?</p>
      </div>
    </section>
  );
};

export default DashBoard;
