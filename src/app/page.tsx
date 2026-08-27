import FindCreatorsButton from "@/components/FindCreatorsButton";
import Image from "next/image";

export default async function Home() {
  return (
    <main>
      <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[#858b98]">
          <Image src={"/hero-icon.svg"} alt="" width={28} height={28}/>
          <span>Ask better questions</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-[#f4f3ef] md:text-8xl">A direct line to the people shaping your world.</h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#858b98]">Thoughtful questions. Real answers. Find a creator, ask what matters, and stay curious.</p>
        <div className="mt-10">
        <FindCreatorsButton />
        </div>
      </section>
    </main>
  );
}
