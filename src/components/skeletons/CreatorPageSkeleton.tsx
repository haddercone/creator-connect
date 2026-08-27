const CreatorPageSkeleton = () => {
  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10" aria-label="Loading creator profile">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start">
        <div className="w-full rounded-2xl border border-[#292d36] bg-[#111318] p-6 md:w-2/5">
          <div className="flex flex-col items-center gap-5">
            <div className="h-40 w-40 animate-pulse rounded-full bg-[#292d36]" />
            <div className="h-9 w-48 animate-pulse rounded bg-[#292d36]" />
            <div className="h-4 w-28 animate-pulse rounded bg-[#292d36]" />
          </div>
          <div className="mt-8 border-t border-[#292d36] pt-6">
            <div className="mb-3 h-3 w-24 animate-pulse rounded bg-[#d8f36b55]" />
            <div className="mb-5 h-6 w-56 animate-pulse rounded bg-[#292d36]" />
            <div className="h-44 animate-pulse rounded-xl bg-[#0a0b0d]" />
            <div className="mt-3 h-12 animate-pulse rounded-lg bg-[#292d36]" />
          </div>
        </div>
        <div className="w-full rounded-2xl border border-[#292d36] bg-[#111318] md:w-3/5">
          <div className="flex items-end justify-between border-b border-[#292d36] px-6 py-5">
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-[#292d36]" />
              <div className="h-6 w-44 animate-pulse rounded bg-[#292d36]" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-[#292d36]" />
          </div>
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-[#292d36] bg-[#171a21] p-4">
                <div className="h-5 w-4/5 animate-pulse rounded bg-[#292d36]" />
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#292d36]" />
                <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-[#292d36]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default CreatorPageSkeleton
