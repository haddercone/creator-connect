"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserForm from "@/components/UserForm";
import CreatorPageSkeleton from "@/components/skeletons/CreatorPageSkeleton";
import { Question } from "../dashboard/types";
import toast from "react-hot-toast";
import { UserProps } from "@/lib/types";

const UserPage = ({ params } : { params: Promise<{ username: string }>}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<UserProps>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function getUserData() {
      try {
        const { username } = await params;
        const [creatoDetailsResponse, answeredQuestionsResponse] = await Promise.all([
          fetch(`/api/creator-details?username=${encodeURIComponent(username)}`),
          fetch(`/api/answered-questions?username=${encodeURIComponent(username)}`)
        ]);

        if (!creatoDetailsResponse.ok || !answeredQuestionsResponse.ok) {
          router.replace("/not-found");
          return;
        }

        const recipentDetails = await creatoDetailsResponse.json();
        const answeredQuestions = await answeredQuestionsResponse.json();

        if(!recipentDetails){
          router.replace("/not-found");
          return;
        }

        setRecipient(recipentDetails);
        setAnsweredQuestions(answeredQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data")
      }
    }
    getUserData();
  }, []);

  if (loading) {
    return <CreatorPageSkeleton />;
  }
  
  return (
    <>
      <main className="min-h-[calc(100vh-73px)] bg-transparent px-6 py-10 text-white">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-[#292d36] bg-[#111318] p-6 md:sticky md:top-28 md:w-2/5">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#d8f36b0d]" />
            <div className="flex gap-5 flex-col justify-center items-center">
              <Image
                draggable={false}
                width={200}
                height={200}
                priority={true}
                className="h-40 w-40 rounded-full ring-4 ring-[#d8f36b22]"
                src={recipient?.profilePic as string}
                alt={recipient?.name as string}
              />
              <p className="text-center text-4xl font-bold tracking-[-0.03em]">{recipient?.name}</p>
              <p className="text-sm text-[#858b98]">@{recipient?.username}</p>
            </div>

            <div className="mt-8 border-t border-[#292d36] pt-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8f36b]">Open inbox</p>
              <p className="mb-5 text-lg font-medium">Ask something worth answering.</p>
              <UserForm
                recipientId={recipient?.id as string}
                recipientName={recipient?.name as string}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-[#292d36] bg-[#111318] md:w-3/5">
            <div className="flex items-end justify-between border-b border-[#292d36] px-6 py-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#858b98]">Public answers</p>
                <p className="text-xl font-semibold">From <span className="font-bold">{recipient?.name}</span></p>
              </div>
              <span className="text-sm text-[#858b98]">{answeredQuestions.length} answered</span>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-4 pt-4">
              {answeredQuestions.length > 0 ? (
                answeredQuestions.map((answeredQuestion) => {
                  return (
                    
                      <div key={answeredQuestion.id} className="grow rounded-xl border border-[#292d36] bg-[#171a21] p-4">
                        <p className="border-b border-[#292d36] pb-3 font-semibold">
                          {answeredQuestion.questionText}
                        </p>
                        <p className="pt-3 leading-7 text-[#aeb3bd]">
                          {answeredQuestion.answer?.answer}
                        </p>
                      </div>
                  );
                })
              ) : (
                <div className="flex min-h-[40vh] items-center justify-center rounded-xl bg-[#171a21] p-6 text-center text-[#858b98]">
                  <p>No answers yet. Start the conversation.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UserPage;
