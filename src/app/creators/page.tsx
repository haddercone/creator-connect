import { Pagination } from "@/components";
import Search from "@/components/Search";
import { getCreatorsByPage } from "@/lib/mongo/geCreatorsByPage";
import { getPopularCreators } from "@/lib/mongo/getPopularCreators";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowRightUpLine, RiFireLine } from "react-icons/ri";

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
  const [{ response, totalUsers, error }, popular] = await Promise.all([
    getCreatorsByPage(pageNumber, perPage),
    getPopularCreators(),
  ]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (response?.length === 0) {
    notFound()
  }

  const popularCreators =
    "error" in popular || popular.length === 0 ? null : popular;
  const featuredCreator = popularCreators?.[0];
  const runnerUps = popularCreators?.slice(1) ?? [];

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

      {popularCreators && (
        <section className="relative mt-10 overflow-hidden rounded-2xl border border-[#292d36] bg-gradient-to-b from-[#171a21] to-[#111318] p-6 shadow-[0_0_32px_rgba(216,243,107,0.05)] md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-[#d8f36b0d]" />
          <div className="relative">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">
                  <RiFireLine className="h-4 w-4" />
                  Trending now
                </p>
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#f4f3ef] md:text-3xl">
                  Most answered creators
                </h2>
                <p className="mt-2 max-w-md text-sm text-[#858b98]">
                  The creators who are actually answering back. They are
                  getting the most public answers on the platform.
                </p>
              </div>
              <span className="text-sm text-[#858b98]">
                Ranked by public answers
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {featuredCreator && (
                <Link
                  href={`/${featuredCreator.username}`}
                  className="group relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-[#d8f36b33] bg-[#111318] p-6 text-center transition-all hover:-translate-y-1 hover:border-[#d8f36b] sm:flex-row sm:items-center sm:text-left"
                >
                  <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 select-none text-[6rem] font-black leading-none tracking-[-0.05em] text-[#d8f36b0f] sm:block">
                    01
                  </span>
                  <Image
                    src={featuredCreator.profilePic}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-[#d8f36b22]"
                    alt={featuredCreator.name}
                  />
                  <div className="min-w-0 grow">
                    <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#d8f36b33] bg-[#d8f36b0d] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8f36b]">
                      <RiFireLine className="h-3.5 w-3.5" />
                      Most answered
                    </p>
                    <p className="truncate text-2xl font-bold tracking-[-0.03em] text-[#f4f3ef] group-hover:text-[#d8f36b]">
                      {featuredCreator.name}
                    </p>
                    <p className="mt-1 text-sm text-[#858b98]">
                      @{featuredCreator.username}
                    </p>
                    <p className="mt-4 text-sm text-[#858b98]">
                      <span className="text-xl font-bold text-[#d8f36b]">
                        {featuredCreator.answeredQuestions}
                      </span>{" "}
                      public answers
                    </p>
                  </div>
                  <RiArrowRightUpLine className="hidden h-6 w-6 shrink-0 text-[#858b98] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#d8f36b] sm:block" />
                </Link>
              )}

              {runnerUps.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {runnerUps.map((creator, index) => (
                    <Link
                      key={creator.id}
                      href={`/${creator.username}`}
                      className="group relative flex items-center gap-3 rounded-2xl border border-[#292d36] bg-[#171a21] p-3.5 transition-all hover:-translate-y-1 hover:border-[#d8f36b66] sm:gap-4 sm:p-4"
                    >
                      <span className="pointer-events-none select-none text-xl font-black tracking-[-0.04em] text-[#292d36] group-hover:text-[#d8f36b22] sm:text-3xl">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                      <Image
                        src={creator.profilePic}
                        width={48}
                        height={48}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[#3a404c] sm:h-12 sm:w-12"
                        alt={creator.name}
                      />
                      <div className="min-w-0 grow">
                        <p className="truncate font-semibold text-[#f4f3ef] group-hover:text-[#d8f36b]">
                          {creator.name}
                        </p>
                        <p className="truncate text-xs text-[#858b98]">
                          @{creator.username}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-[#858b98]">
                        <span className="font-bold text-[#d8f36b]">
                          {creator.answeredQuestions}
                        </span>{" "}
                        <span className="hidden min-[400px]:inline">
                          answers
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
          totaUsers={totalUsers as number}
          hasNext={end < (totalUsers as number)}
          hasPrevious={start > 0}
        />
    </main>
  );
};

export default CreatorsList;
