const PodiumSkeleton = () => {
  return (
    <section
      aria-label="Loading most answered creators"
      className="relative mt-10 overflow-hidden rounded-2xl border border-[#292d36] bg-gradient-to-b from-[#171a21] to-[#111318] p-6 md:p-8"
    >
      <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-[#d8f36b0d]" />
      <div className="relative">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[#292d36]" />
            <div className="h-7 w-56 max-w-full animate-pulse rounded-lg bg-[#292d36]" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#292d36]" />
          </div>
          <div className="h-4 w-36 animate-pulse rounded bg-[#292d36]" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:items-end">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-5 rounded-2xl border border-[#292d36] bg-[#111318] p-6 text-center ${
                index === 0 ? "sm:py-9" : ""
              }`}
            >
              <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-[#292d36]" />
              <div className="w-full space-y-2.5">
                <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-[#292d36]" />
                <div className="h-5 w-32 max-w-full animate-pulse rounded bg-[#292d36]" />
                <div className="mx-auto h-3 w-20 animate-pulse rounded bg-[#292d36]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodiumSkeleton;