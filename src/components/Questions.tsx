"use client";
import { deleteQuestion, getAllQuestionsByUser } from "@/app/actions/actions";
import { Question } from "@/app/dashboard/types";
import { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { MdDelete, MdOutlineQuestionAnswer } from "react-icons/md";
import AnswerForm from "./AnswerForm";
import toast from "react-hot-toast";
import QuestionsSkeleton from "./skeletons/QuestionsSkeleton";

function Questions({ email }: { email: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadQuestions, setLoadQuestions] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentOpenQuestion, setCurrentOpenQuestion] = useState<string>("")

  const questionsTypes : string[] = ["all", "answered", "unanswered"]
  useEffect(() => {    
    (async () => {
      const questions  = await getAllQuestionsByUser(email);
      setQuestions(questions as Question[]);
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

  const filteredQuestions =  questions.filter((question) => {
      if(activeTab === "all") {
        return true;
      } else if (activeTab === "answered") {
        return question.isAnswered === true;
      } else {
        return question.isAnswered === false;
      }
    });

  if (loadQuestions) {
    return (
      <QuestionsSkeleton />
    );
  }

  return questions && questions.length === 0 ? (
    <div className="h-[50vh] flex justify-center items-center sm:text-4xl text-slate-500 gap-4 flex-col">
      <div className="text-6xl">
        <MdOutlineQuestionAnswer />
      </div>
      <p>No questions yet...</p>
    </div>
  ) : (
    <>
      <div className="flex justify-between gap-2 border-b-[1px] border-b-slate-400 overflow-auto whitespace-nowrap">
        {questionsTypes.map((type) => {
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setCurrentOpenQuestion("")
              }}
              className={`${
                isActive ? "bg-slate-700" : ""
              } grow mb-2 rounded p-2`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} questions {type === "all" ? `(${questions.length})` : null}
            </button>
          );
        })}
      </div>
      {filteredQuestions &&
        filteredQuestions.map((question, idx) => {
          return (
            <div key={question?.id as string}>
              <div className="flex justify-between items-center my-2 bg-slate-950 p-2 rounded">
                <p>{question?.questionText}</p>

                <div className=" flex justify-between gap-4">
                  <button
                    onClick={() => setCurrentOpenQuestion(currentOpenQuestion === question.id ? "": question.id as string)}
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
              <AnswerForm
                isOpen = {currentOpenQuestion === question.id}
                setOpenQuestion ={() => setCurrentOpenQuestion(currentOpenQuestion === question.id as string ? "" : question.id as string)}
                question={question}
                questions={questions}
                setQuestions={setQuestions}
              />
            </div>
          );
        })}
    </>
  );
}

export default Questions;
