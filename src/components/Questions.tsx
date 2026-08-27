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
  const [currentOpenQuestion, setCurrentOpenQuestion] = useState<string>("");

  const questionsTypes: string[] = ["all", "answered", "unanswered"];
  useEffect(() => {
    (async () => {
      const questions = await getAllQuestionsByUser(email);
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

  const filteredQuestions = questions.filter((question) => {
    if (activeTab === "all") {
      return true;
    } else if (activeTab === "answered") {
      return question.isAnswered === true;
    } else {
      return question.isAnswered === false;
    }
  });

  if (loadQuestions) {
    return <QuestionsSkeleton />;
  }

  return questions && questions.length === 0 ? (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-[#858b98]">
      <div className="text-6xl">
        <MdOutlineQuestionAnswer />
      </div>
      <p className="text-lg font-medium">No questions yet...</p>
    </div>
  ) : (
    <>
      <div className="flex gap-1 overflow-auto rounded-xl border border-[#292d36] bg-[#0a0b0d] p-1 sm:w-fit">
        {questionsTypes.map((type) => {
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setCurrentOpenQuestion("");
              }}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#d8f36b] text-[#171b0a]"
                  : "text-[#858b98] hover:text-[#f4f3ef]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className={isActive ? "text-[#171b0a66]" : "text-[#5b616d]"}>
                {" "}
                {type === "all" ? `(${questions.length})` : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filteredQuestions &&
          filteredQuestions.map((question) => {
            return (
              <div key={question?.id as string} className="rounded-xl border border-[#292d36] bg-[#0a0b0d] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 grow leading-7 text-[#f4f3ef]">
                    {question?.questionText}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() =>
                        setCurrentOpenQuestion(
                          currentOpenQuestion === question.id
                            ? ""
                            : (question.id as string)
                        )
                      }
                      className="rounded-lg p-2 text-[#d8f36b] transition-colors hover:bg-[#F1F1F11F]"
                      title="answer"
                    >
                      <BiComment />
                    </button>
                    <button
                      onClick={() => deleteAction(question.id as string)}
                      className="rounded-lg p-2 text-[#f87171] transition-colors hover:bg-[#F1F1F11F]"
                      title="delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
                <AnswerForm
                  isOpen={currentOpenQuestion === question.id}
                  setOpenQuestion={() =>
                    setCurrentOpenQuestion(
                      currentOpenQuestion === question.id
                        ? ""
                        : (question.id as string)
                    )
                  }
                  question={question}
                  questions={questions}
                  setQuestions={setQuestions}
                />
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Questions;