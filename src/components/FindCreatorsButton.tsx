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
      className="relative px-4 py-2 border-2 border-slate-900 shadow-sm rounded bg-slate-900 duration-200 disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Find Creators..." : "Find Creators"}
    </button>
  );
};

export default FindCreatorsButton;
