import ApproveButton from "@/components/adminComponents/ApproveButton";
import RejectButton from "@/components/adminComponents/RejectButton";
import { useServerSession } from "@/hooks";
import { getAllQuestions } from "@/lib/mongo/getAllQuestions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdOutlineQuestionAnswer } from "react-icons/md";

const AdminDashBoard = async () => {
  const session = await useServerSession();

  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }

  const allQuestions = await getAllQuestions();

  if ("error" in allQuestions) {
    return <p className="text-[#858b98]">{allQuestions.error}</p>;
  }

  if (allQuestions.length === 0) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#292d36] bg-[#111318] px-8 py-12 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#171a21] text-3xl text-[#d8f36b]">
            <MdOutlineQuestionAnswer />
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#f4f3ef]">
            All caught up
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#858b98]">
            There are no pending questions in the moderation queue right now.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">
            Moderation queue
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-[#f4f3ef]">
            Admin Dashboard
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#858b98]">
            <span className="h-2 w-2 rounded-full bg-[#d8f36b]" />
            {allQuestions.length} pending{" "}
            {allQuestions.length === 1 ? "question" : "questions"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {allQuestions.map(({ id, questionText, recipient }) => {
            return (
              <div
                key={id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#292d36] bg-[#111318] p-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold leading-7 text-[#f4f3ef]">
                    {questionText}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#858b98]">
                    <span>For</span>
                    <Link
                      className="flex items-center gap-2 font-medium text-[#f4f3ef] hover:text-[#d8f36b]"
                      href={`/${recipient.username}`}
                    >
                      <Image
                        src={recipient.profilePic}
                        width={20}
                        height={20}
                        className="rounded-full ring-1 ring-[#3a404c]"
                        alt={recipient.name}
                      />
                      @{recipient.username}
                    </Link>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <ApproveButton id={id as string} />
                  <RejectButton id={id as string} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminDashBoard;