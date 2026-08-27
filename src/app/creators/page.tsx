import { MostAnsweredSection, Pagination, PodiumSkeleton } from "@/components";
import Search from "@/components/Search";
import { getCreatorsByPage } from "@/lib/mongo/geCreatorsByPage";
import { getPopularCreators } from "@/lib/mongo/getPopularCreators";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RiArrowRightUpLine } from "react-icons/ri";

const CreatorsList = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const pageParam = params["page"];
  const currentPage = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Math.max(1, Number(currentPage) || 1);
  const perPage = 4;

  const start = (pageNumber - 1) * perPage;
  const end = start + perPage;
  const popular = await getPopularCreators();
  const popularCreators =
    !popular || "error" in popular || popular.length === 0 ? null : popular;
  const podiumIds = popularCreators?.map((c) => c.id) ?? [];
  const { response, totalUsers, gridTotal, error } = await getCreatorsByPage(
    pageNumber,
    perPage,
    podiumIds
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (response?.length === 0) {
    notFound()
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-6 py-10">
      <div className="border-b border-[#292d36] pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">The directory</p>
            <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-6xl">Find your next signal.</h1>
            <p className="mt-3 max-w-md text-[#858b98]">Browse creators, open a profile, and start a better conversation.</p>
          </div>
          <div className="w-full md:max-w-sm">
              <Search />
          </div>
        </div>
        <div className="mt-8 flex items-center gap-3 text-sm text-[#858b98]">
          <span className="h-2 w-2 rounded-full bg-[#d8f36b]" />
          <span>{totalUsers} creators to explore</span>
        </div>
      </div>

      <Suspense fallback={<PodiumSkeleton />}>
        <MostAnsweredSection />
      </Suspense>

      <div className="my-8 grid gap-4 md:grid-cols-2">
          {Array.isArray(response) &&
            response.map(({ id, name, profilePic, username }, index) => {
              return (
                <Link
                  href={`/${username}`}
                  className="group relative flex min-h-36 w-full items-center gap-4 overflow-ellipsis rounded-2xl border border-[#292d36] bg-[#111318] p-4 hover:-translate-y-1 hover:border-[#d8f36b66] hover:bg-[#171a21] sm:gap-5 sm:p-5"
                  key={id}
                >
                  <Image
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-[#3a404c] sm:h-20 sm:w-20"
                    src={profilePic}
                    alt={name}
                    width={80}
                    height={80}
                  />

                  <div className="min-w-0 pr-8">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#858b98]">Creator {String(index + 1).padStart(2, "0")}</p>
                    <p className="truncate text-xl font-semibold tracking-[-0.02em] text-[#f4f3ef] group-hover:text-[#d8f36b]">{name}</p>
                    <span className="text-sm text-[#858b98]">@{username}</span>
                  </div>
                  <RiArrowRightUpLine className="absolute right-5 top-5 h-5 w-5 text-[#858b98] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#d8f36b]" />
                </Link>
              );
            })}
      </div>
        <Pagination
          perPage={perPage}
          totaUsers={gridTotal as number}
          hasNext={end < (gridTotal as number)}
          hasPrevious={start > 0}
        />
    </main>
  );
};

export default CreatorsList;
