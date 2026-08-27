"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  perPage: number;
  totaUsers: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  perPage,
  totaUsers,
  hasNext,
  hasPrevious,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const [isPending, startTransition] = useTransition();

  const goToPage = (nextPage: number) => {
    startTransition(() => {
      router.push(`/creators?page=${nextPage}`);
    });
  };

  return (
    <div className="flex items-center justify-between m-4">
      <button
        className={`flex gap-2 items-center border-2 rounded px-3 py-2 sm:px-4 sm:py-2  ${
          !hasPrevious
            ? "opacity-35"
            : "hover:scale-105 transition-all bg-slate-700"
        }`}
        disabled={!hasPrevious || isPending}
        onClick={() => goToPage(Number(page) - 1)}
      >
        <IoIosArrowBack />
        {isPending ? "Prev..." : "Prev"}
      </button>
      <p className="hidden min-[380px]:block">
        Page {page} of {Math.ceil(totaUsers / perPage)}{" "}
      </p>
      <button
        className={`flex gap-2 items-center border-2 rounded px-3 py-2 sm:px-4 sm:py-2  ${
          !hasNext
            ? "opacity-35"
            : "hover:scale-105 transition-all bg-slate-700"
        }`}
        disabled={!hasNext || isPending}
        onClick={() => goToPage(Number(page) + 1)}
      >
        {isPending ? "Next..." : "Next"}
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
