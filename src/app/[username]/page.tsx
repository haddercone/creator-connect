"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserForm from "@/components/UserForm";
import { Question } from "../dashboard/types";
import toast from "react-hot-toast";
import { UserProps } from "@/lib/types";

const UserPage = ({ params } : { params: { username: string }}) => {
  const { username } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<UserProps>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function getUserData() {
      try {
        const [creatoDetailsResponse, answeredQuestionsResponse] = await Promise.all([
          fetch(`/api/creator-details?username=${username}`),
          fetch(`/api/answered-questions?username=${username}`)
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
    return (
      <div className="h-screen flex justify-center items-center">
        Loading ....
      </div>
    );
  }
  
  return (
    <>
      <section className=" flex min-h-screen gap-10 justify-center items-center md:p-5 md:items-start md:flex-row flex-col  bg-gray-900  text-white py-8 ">
          <div className="bg-[#00000039] lg:w-1/3 md:w-1/2 p-4 rounded">
            <div className="flex gap-5 flex-col justify-center items-center">
              <Image
                draggable={false}
                width={200}
                height={200}
                priority={true}
                className="w-40 h-40 rounded-full"
                src={recipient?.profilePic as string}
                alt={recipient?.name as string}
              />
              <p className="text-4xl font-bold">{recipient?.name}</p>
            </div>

            <div className="flex justify-center items-center flex-col gap-5 ">
              <p>Ask your question to {recipient?.name}</p>
              <UserForm
                recipientId={recipient?.id as string}
                recipientName={recipient?.name as string}
              />
            </div>
          </div>
          <div className="md:w-1/2 bg-[#00000039] rounded">
            <p className="px-4 text-2xl bg-slate-600 py-2 rounded-t-sm">
              Questions answered by{" "}
              <span className="font-bold">{recipient?.name}</span>
            </p>
            <div className="flex px-4 mt-4  gap-5 flex-col pb-4">
              {answeredQuestions.length > 0 ? (
                answeredQuestions.map((answeredQuestion) => {
                  return (
                    
                      <div key={answeredQuestion.id} className="border border-slate-600 grow p-2 rounded">
                        <p className=" font-bold border border-transparent border-b-slate-600 pb-2">
                          {answeredQuestion.questionText}
                        </p>
                        <p className="text-slate-400 pt-2">
                          {answeredQuestion.answer?.answer}
                        </p>
                      </div>
                  );
                })
              ) : (
                <div className="bg-[#F1F1F11F] lg:text-2xl p-2 flex justify-center text-center items-center min-h-[50vh] rounded text-slate-400">
                  <p>No Questions answered yet...</p>
                </div>
              )}
            </div>
          </div>
      </section>
    </>
  );
};

export default UserPage;
