"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserProps, Username } from "./types";
import Image from "next/image";
import UserForm from "@/components/UserForm";
import { Question } from "../dashboard/types";
import toast from "react-hot-toast";

const UserPage = () => {
  const params = useParams();
  const router = useRouter();
  const username: Username = params.username;
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

  return (
    <>
      <section className=" flex min-h-screen gap-10 justify-center items-center md:p-5 md:items-start md:flex-row flex-col  bg-gray-900  text-white py-8 ">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-[#00000039] py-2 px-4 rounded my-2">
            <div className="flex gap-5 p-2 flex-col justify-center items-center">
              <Image
                draggable={false}
                width={200}
                height={200}
                className="w-40 h-40 rounded-full"
                src={recipient?.profilePic as string}
                alt="user_profile"
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
        )}
        {loading ? null : (
          <div className="py-2 md:w-1/2">
            <p className="px-4 text-2xl">
              Questions answered by{" "}
              <span className="font-bold">{recipient?.name}</span>
            </p>
            <div className="flex px-4 mt-4  gap-5 flex-col">
              {answeredQuestions && answeredQuestions.length > 0 ? (
                answeredQuestions.map((answeredQuestion) => {
                  return (
                    answeredQuestion.isAnswered && (
                      <div key={answeredQuestion.id} className="border border-slate-600 grow p-2 rounded">
                        <p className=" font-bold border border-transparent border-b-slate-600 pb-2">
                          {answeredQuestion.questionText}
                        </p>
                        <p className="text-slate-400 pt-2">
                          {answeredQuestion.answer?.answer}
                        </p>
                      </div>
                    )
                  );
                })
              ) : (
                <div className="bg-[#F1F1F11F] lg:text-2xl p-2 flex justify-center text-center items-center min-h-[50vh] rounded text-slate-400">
                  <p>No Questions answered yet...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default UserPage;
