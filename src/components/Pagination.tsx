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

  const buttonBase =
    "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:py-2";
  const buttonEnabled =
    "border-[#292d36] bg-[#171a21] text-[#f4f3ef] hover:border-[#d8f36b] hover:text-[#d8f36b]";
  const buttonDisabled = "cursor-not-allowed border-[#292d36] opacity-30";

  return (
    <div className="mx-0 my-8 flex items-center justify-between sm:mx-4">
      <button
        className={`${buttonBase} ${
          !hasPrevious || isPending ? buttonDisabled : buttonEnabled
        }`}
        disabled={!hasPrevious || isPending}
        onClick={() => goToPage(Number(page) - 1)}
      >
        <IoIosArrowBack />
        <span>{isPending ? "Prev..." : "Prev"}</span>
      </button>
      <p className="hidden text-sm text-[#858b98] min-[380px]:block">
        Page {page} of {Math.ceil(totaUsers / perPage)}
      </p>
      <button
        className={`${buttonBase} ${
          !hasNext || isPending ? buttonDisabled : buttonEnabled
        }`}
        disabled={!hasNext || isPending}
        onClick={() => goToPage(Number(page) + 1)}
      >
        <span>{isPending ? "Next..." : "Next"}</span>
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
