"use client";
import { useSearchParams, useRouter } from "next/navigation";
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

  return (
    <div className="flex items-center justify-between m-4">
      <button
        className={`flex gap-2 items-center border-2 rounded px-4 py-2  ${
          !hasPrevious
            ? "opacity-35"
            : "hover:scale-105 transition-all bg-slate-700"
        }`}
        disabled={!hasPrevious}
        onClick={() => router.back()}
      >
        <IoIosArrowBack />
        Prev
      </button>
      <p>
        Page {page} of {Math.ceil(totaUsers / perPage)}{" "}
      </p>
      <button
        className={`flex gap-2 items-center border-2 rounded px-4 py-2  ${
          !hasNext
            ? "opacity-35"
            : "hover:scale-105 transition-all bg-slate-700"
        }`}
        disabled={!hasNext}
        onClick={() => router.push(`/creators?page=${Number(page) + 1}`)}
      >
        Next
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
