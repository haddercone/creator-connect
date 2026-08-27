import Link from "next/link";
import { RiArrowGoBackFill } from "react-icons/ri";

const NotFound = () => {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#292d36] bg-[#111318] px-8 py-14 text-center">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#d8f36b0d]" />
        <p className="relative text-6xl font-black tracking-[-0.05em] text-[#d8f36b]">
          404
        </p>
        <p className="relative mt-5 text-xl font-semibold tracking-[-0.02em] text-[#f4f3ef]">
          This page could not be found.
        </p>
        <p className="relative mt-2 text-sm leading-6 text-[#858b98]">
          The creator or page you&rsquo;re looking for doesn&rsquo;t exist or
          has moved.
        </p>
        <Link
          href="/"
          className="relative mt-8 inline-flex items-center gap-2 rounded-xl border border-[#3a404c] bg-[#171a21] px-5 py-3 text-sm font-semibold text-[#f4f3ef] transition-colors hover:border-[#d8f36b] hover:text-[#d8f36b]"
        >
          <RiArrowGoBackFill />
          Go back home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;