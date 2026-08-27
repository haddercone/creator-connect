"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

const FindCreatorsButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => router.push("/creators"));
      }}
      className="relative rounded-lg bg-[#d8f36b] px-5 py-3 font-semibold text-[#171b0a] shadow-[0_0_28px_rgba(216,243,107,0.12)] hover:bg-[#e4fa8a] disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Find Creators..." : "Find Creators"}
    </button>
  );
};

export default FindCreatorsButton;
