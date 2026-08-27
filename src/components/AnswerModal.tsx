"use client";

import { Question } from "@/app/dashboard/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import AnswerForm from "./AnswerForm";

type AnswerModalProps = {
  question: Question;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  onClose: () => void;
};

const AnswerModal = ({
  question,
  questions,
  setQuestions,
  onClose,
}: AnswerModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const answered = Boolean(question.isAnswered);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#0a0b0de6] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#292d36] bg-[#111318] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#292d36] p-5">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">
              Answer question
            </p>
            <h2 className="text-lg font-bold leading-7 tracking-[-0.02em] text-[#f4f3ef]">
              {question.questionText}
            </h2>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  answered ? "bg-[#d8f36b]" : "bg-[#5b616d]"
                }`}
              />
              <span className={answered ? "text-[#d8f36b]" : "text-[#858b98]"}>
                {answered ? "Answered" : "Awaiting your answer"}
              </span>
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[#858b98] transition-colors hover:bg-[#F1F1F11F] hover:text-[#f4f3ef]"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <AnswerForm
            isOpen={true}
            setOpenQuestion={onClose}
            question={question}
            questions={questions}
            setQuestions={setQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;