const DashBoardSkeleton = () => {
  return (
    <div
      className="mx-auto max-w-6xl px-6 py-10"
      aria-label="Loading dashboard"
    >
      <div className="mb-8 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-[#d8f36b55]" />
        <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-[#292d36]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[#292d36]" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-3 sm:w-1/4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl border border-[#292d36] bg-[#111318]"
            />
          ))}
        </div>
        <div className="h-[60vh] w-full animate-pulse rounded-2xl border border-[#292d36] bg-[#111318] sm:flex-1">
          <div className="m-4 flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-9 w-24 animate-pulse rounded-lg bg-[#292d36]" />
            ))}
          </div>
          <div className="space-y-3 px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-[#292d36]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardSkeleton;