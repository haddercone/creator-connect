const CreatorDirectoryLoading = () => {
  return (
    <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-6 py-10" aria-label="Loading creators">
      <div className="border-b border-[#292d36] pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-[#d8f36b55]" />
            <div className="h-12 w-80 max-w-full animate-pulse rounded-lg bg-[#292d36] md:h-16" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#292d36]" />
          </div>
          <div className="h-11 w-full animate-pulse rounded-xl border border-[#292d36] bg-[#111318] md:max-w-sm" />
        </div>
        <div className="mt-8 h-4 w-40 animate-pulse rounded bg-[#292d36]" />
      </div>
      <div className="my-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex min-h-36 items-center gap-4 rounded-2xl border border-[#292d36] bg-[#111318] p-4 sm:gap-5 sm:p-5">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-[#292d36] sm:h-20 sm:w-20" />
            <div className="space-y-3">
              <div className="h-3 w-20 animate-pulse rounded bg-[#292d36]" />
              <div className="h-5 w-40 animate-pulse rounded bg-[#292d36]" />
              <div className="h-3 w-24 animate-pulse rounded bg-[#292d36]" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-10 animate-pulse rounded-xl bg-[#111318]" />
    </main>
  );
};

export default CreatorDirectoryLoading;