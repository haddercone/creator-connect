const AdminDashboardLoading = () => {
  return (
    <main
      className="min-h-[calc(100vh-73px)] px-6 py-10"
      aria-label="Loading admin dashboard"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-[#d8f36b55]" />
          <div className="h-9 w-64 max-w-full animate-pulse rounded-lg bg-[#292d36]" />
          <div className="h-4 w-40 animate-pulse rounded bg-[#292d36]" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#292d36] bg-[#111318] p-5"
            >
              <div className="space-y-3">
                <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#292d36]" />
                <div className="h-4 w-40 animate-pulse rounded bg-[#292d36]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-24 animate-pulse rounded-lg bg-[#292d36]" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-[#292d36]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardLoading;