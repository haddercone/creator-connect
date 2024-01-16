"use client";

import { redirect, useRouter } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { MdDelete , MdOutlineQuestionAnswer} from "react-icons/md";
import { BiComment } from "react-icons/bi";
import { clientSession } from "../auth/clientSession";
import LogoutButton from "@/components/LogoutButton";
import React, { useEffect, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { RiArrowRightSLine } from "react-icons/ri";
import { signOut } from "next-auth/react";
import { getAllQuestionsByUser, answerQuestion, deleteQuestion } from "../actions/actions";
import DashBoardSkeleton from "@/components/DashBoardSkeleton";
import { Question } from "./types";

const DashBoard = () => {
  const session = clientSession();
  const [open, setOpen] = useState(false);
  const { data, status } = session;

  function handleMenuClick() {
    setOpen(!open);
  }
  const ref = useClickOutside(handleMenuClick);

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (status == "loading") {
    return <DashBoardSkeleton />;
  }

  return (
    data?.user && (
      <section className="bg-slate-800 min-h-screen">
        {open && (
          <aside
            ref={ref}
            className={`fixed  bottom-0  top-0 left-0 flex flex-col justify-between bg-slate-900 p-4  text-white ${
              open ? "animate-openmenu" : "animate-closemenu"
            }`}
          >
            <div className="flex justify-around items-center gap-3 rounded bg-[#FFFFFF39] px-4 py-2 flex-wrap container">
              <img
                className="w-14 h-14 rounded-full"
                src={data?.user.image as string}
                alt=""
              />
              {data?.user.name}
            </div>
            <LogoutButton />
          </aside>
        )}

        <div className="text-white">
          <nav className="flex justify-between p-4 gap-4 items-center bg-slate-900">
            <div className="flex gap-4">
              <button onClick={handleMenuClick}>
                <CiMenuBurger />
              </button>
              <p>
                Creator connect / <span className="font-bold">Dashboard</span>
              </p>
            </div>
            <button onClick={() => signOut()}>Log Out</button>
          </nav>
        </div>
        <div className="p-4">
          <p className="text-2xl bg-slate-950 rounded p-2">
            {data?.user.name}'s dashboard
          </p>
          <div className="flex  flex-col sm:flex-row gap-4 min-h-full my-4">
            <div className="w-full sm:w-1/5 flex  flex-col  rounded ">
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full rounded-t  py-2">
                All questions
                <RiArrowRightSLine />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full border border-transparent border-t-slate-700 border-b-slate-700 py-2">
                All questions
                <RiArrowRightSLine />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-950 w-full rounded-b  py-2">
                All questions
                <RiArrowRightSLine />
              </button>
            </div>
            <div className="w-full h-fit bg-slate-900 p-4 rounded">
              <Questions email={data.user.email as string} />
            </div>
          </div>
        </div>
      </section>
    )
  );
};

function Questions({ email }: { email: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);
  useEffect(() => {
    (async () => {
      const questions = await getAllQuestionsByUser(email);
      // console.log(questions);
      setQuestions(questions as Question[]);
      setOpenStates(new Array(questions?.length).fill(false));
    })();

  }, []);

  const toggleOpenState = (index: number) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    questions.length === 0 ? <div className="h-[50vh] flex justify-center items-center sm:text-4xl text-slate-500 gap-4 flex-col">
      <div className="text-6xl"><MdOutlineQuestionAnswer/></div>
      <p>No questions yet...</p>
    </div> :
    questions.map((question, idx) => {
      return (
        <div key={question?.id as string}>
          <div className="flex justify-between items-center my-2 bg-slate-950 p-2 rounded">
            <p>{question?.questionText}</p>
            <div className=" flex justify-between gap-4">
              <button
                onClick={() => toggleOpenState(idx)}
                className="text-green-700 p-2 rounded hover:bg-[#F1F1F11F]"
                title="answer"
              >
                <BiComment />
              </button>
              <button
                onClick={() => deleteQuestion(question.id as string)}
                className="text-red-700 mr-2 p-2 rounded hover:bg-[#F1F1F11F]"
                title="delete"
              >
                <MdDelete />
              </button>
            </div>
          </div>
          {openStates[idx] && (
            <>
              <form
                action={async (formdata) =>
                  answerQuestion(question?.id as string, formdata)
                }
              >
                <textarea name="answerText" className="w-full bg-transparent outline-none border border-gray-400"></textarea>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => toggleOpenState(idx)} className="px-4 py-1 bg-red-600 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1 bg-green-600 rounded">
                    Submit
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      );
    })
  );
}

export default DashBoard;
