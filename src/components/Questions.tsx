"use client";
import { deleteQuestion, getAllQuestionsByUser } from "@/app/actions/actions";
import { Question } from "@/app/dashboard/types";
import { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { MdDelete, MdOutlineQuestionAnswer } from "react-icons/md";
import AnswerForm from "./AnswerForm";
import { Answer } from "@/lib/types";
import toast from "react-hot-toast";
import useToggleQuestionOpenState from "@/hooks/useToggleQuestionOpenState";
import QuestionsSkeleton from "./QuestionsSkeleton";

function Questions({ email }: { email: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadQuestions, setLoadQuestions] = useState<boolean>(true);
  const {OpenStates, toggleOpenState, setOpenStates} = useToggleQuestionOpenState()

  useEffect(() => {    
    (async () => {
      const questions = await getAllQuestionsByUser(email);
      setQuestions(questions as Question[]);
      setOpenStates(new Array(questions?.length).fill(false));
      setLoadQuestions(false);
    })();
  }, []);

  async function deleteAction(id: string) {
    const response = await deleteQuestion(id);
    if (response?.error) {
      toast.error(response.error);
      return;
    }
    const newQuestions = questions.filter((question) => question.id !== id);
    setQuestions(newQuestions);
    toast.success("Question deleted successfully");
  }

  if (loadQuestions) {
    return (
      <QuestionsSkeleton />
      // <div className="h-[50vh] flex justify-center items-center sm:text-4xl text-slate-500">
      //   Loading...
      // </div>
    );
  }

  return questions.length === 0 ? (
    <div className="h-[50vh] flex justify-center items-center sm:text-4xl text-slate-500 gap-4 flex-col">
      <div className="text-6xl">
        <MdOutlineQuestionAnswer />
      </div>
      <p>No questions yet...</p>
    </div>
  ) : (
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
                onClick={() => deleteAction(question.id as string)}
                className="text-red-700 mr-2 p-2 rounded hover:bg-[#F1F1F11F]"
                title="delete"
              >
                <MdDelete />
              </button>
            </div>
          </div>
          {OpenStates[idx] && (
            <AnswerForm
              question={question}
              questions={questions}
              setQuestions={setQuestions}
              toggleOpenState={(arg: number) => toggleOpenState(arg)}
              idx={idx}
            />
          )}
        </div>
      );
    })
  );
}

export default Questions;
