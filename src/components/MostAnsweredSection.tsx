import Image from "next/image";
import Link from "next/link";
import { RiFireLine } from "react-icons/ri";
import {
  getPopularCreators,
  type PopularCreator,
} from "@/lib/mongo/getPopularCreators";

const podiumStyles = [
  {
    label: "Most answered",
    order: "sm:order-2",
    raise: "sm:py-9",
    box: "border-[#e8c26866]",
    ring: "ring-[#e8c2684d]",
    pill: "border-[#e8c26833] bg-[#e8c2680d] text-[#e8c268]",
    accent: "text-[#e8c268]",
    avatar: "h-24 w-24",
  },
  {
    label: "2nd most answered",
    order: "sm:order-1",
    box: "border-[#bec5d0b3]",
    ring: "ring-[#bec5d033]",
    pill: "border-[#bec5d033] bg-[#bec5d00d] text-[#bec5d0]",
    accent: "text-[#bec5d0]",
    avatar: "h-20 w-20",
  },
  {
    label: "3rd most answered",
    order: "sm:order-3",
    box: "border-[#cd8b5ab3]",
    ring: "ring-[#cd8b5a33]",
    pill: "border-[#cd8b5a33] bg-[#cd8b5a0d] text-[#cd8b5a]",
    accent: "text-[#cd8b5a]",
    avatar: "h-20 w-20",
  },
];

const MostAnsweredSection = async () => {
  const popular = await getPopularCreators();
  const popularCreators =
    !popular || "error" in popular || popular.length === 0 ? null : popular;

  if (!popularCreators) return null;

  const renderPodiumCard = (
    creator: PopularCreator | undefined,
    rank: number
  ) => {
    if (!creator) return null;
    const style = podiumStyles[rank];
    return (
      <Link
        key={creator.id}
        href={`/${creator.username}`}
        className={`group relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border bg-[#111318] p-6 text-center transition-all hover:-translate-y-1 ${style.box} ${style.order} ${style.raise ?? ""}`}
      >
        <Image
          src={creator.profilePic}
          width={96}
          height={96}
          className={`${style.avatar} shrink-0 rounded-full object-cover ring-4 ${style.ring}`}
          alt={creator.name}
        />
        <div className="min-w-0 w-full">
          <p
            className={`mb-2 inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${style.pill}`}
          >
            {style.label}
          </p>
          <p className="truncate text-xl font-bold tracking-[-0.03em] text-[#f4f3ef] group-hover:text-[#d8f36b] sm:text-2xl">
            {creator.name}
          </p>
          <p className="mt-1 text-sm text-[#858b98]">@{creator.username}</p>
          <p className="mt-3 text-sm text-[#858b98]">
            <span className={`text-lg font-bold ${style.accent}`}>
              {creator.answeredQuestions}
            </span>{" "}
            public answers
          </p>
        </div>
      </Link>
    );
  };

  return (
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
              The creators who are actually answering back. They are getting
              the most public answers on the platform.
            </p>
          </div>
          <span className="text-sm text-[#858b98]">
            Ranked by public answers
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:items-end">
          {renderPodiumCard(popularCreators[0], 0)}
          {renderPodiumCard(popularCreators[1], 1)}
          {renderPodiumCard(popularCreators[2], 2)}
        </div>
      </div>
    </section>
  );
};

export default MostAnsweredSection;