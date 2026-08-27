const QuestionsSkeleton = () => {
  return (
    <div role="status" aria-label="Loading questions" className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-24 animate-pulse rounded-xl bg-[#292d36]"
          />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 rounded-xl border border-[#292d36] bg-[#0a0b0d] p-4"
        >
          <div className="space-y-2">
            <div className="h-3 w-56 max-w-full animate-pulse rounded bg-[#292d36]" />
            <div className="h-3 w-40 animate-pulse rounded bg-[#292d36]" />
          </div>
          <div className="flex shrink-0 gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#292d36]" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#292d36]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsSkeleton;