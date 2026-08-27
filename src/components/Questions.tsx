"use client";
import { getAllQuestionsByUser } from "@/app/actions/actions";
import { Question } from "@/app/dashboard/types";
import { useEffect, useState } from "react";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import AnswerModal from "./AnswerModal";
import QuestionCard from "./QuestionCard";
import QuestionsSkeleton from "./skeletons/QuestionsSkeleton";

function Questions({ email }: { email: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadQuestions, setLoadQuestions] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  const questionsTypes: string[] = ["all", "answered", "unanswered"];
  useEffect(() => {
    (async () => {
      const questions = await getAllQuestionsByUser(email);
      setQuestions(questions as Question[]);
      setLoadQuestions(false);
    })();
  }, []);

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
                setActiveQuestion(null);
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filteredQuestions &&
          filteredQuestions.map((question) => {
            return (
              <QuestionCard
                key={question?.id as string}
                question={question}
                questions={questions}
                setQuestions={setQuestions}
                onOpen={() => setActiveQuestion(question)}
              />
            );
          })}
      </div>

      {activeQuestion && (
        <AnswerModal
          key={activeQuestion.id as string}
          question={activeQuestion}
          questions={questions}
          setQuestions={setQuestions}
          onClose={() => setActiveQuestion(null)}
        />
      )}
    </>
  );
}

export default Questions;