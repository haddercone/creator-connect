"use client";

import { deleteQuestion } from "@/app/actions/actions";
import { Question } from "@/app/dashboard/types";
import { useClickOutside } from "@/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import {
  RiArrowDropDownLine,
  RiDeleteBinLine,
  RiMore2Fill,
} from "react-icons/ri";
import AnswerForm from "./AnswerForm";
import toast from "react-hot-toast";

type QuestionCardProps = {
  question: Question;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  isOpen: boolean;
  onToggle: () => void;
};

const QuestionCard = ({
  question,
  questions,
  setQuestions,
  isOpen,
  onToggle,
}: QuestionCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setMenuOpen(false)) as React.RefObject<HTMLDivElement>;

  const answered = Boolean(question.isAnswered);

  async function deleteAction(id: string) {
    const response = await deleteQuestion(id);
    if (response?.error) {
      toast.error(response.error);
      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
    toast.success("Question deleted successfully");
  }

  return (
    <div
      className={`rounded-2xl border bg-[#0a0b0d] transition-colors ${
        isOpen ? "border-[#d8f36b66]" : "border-[#292d36]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          title={isOpen ? "Close answer" : "Answer this question"}
          className="min-w-0 grow cursor-pointer rounded-lg text-left"
        >
          <span className="flex items-baseline gap-3">
            <p className="min-w-0 grow leading-6 text-[#f4f3ef]">
              {question.questionText}
            </p>
            <RiArrowDropDownLine
              className={`h-7 w-7 shrink-0 text-[#858b98] transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                answered ? "bg-[#d8f36b]" : "bg-[#5b616d]"
              }`}
            />
            <span className={answered ? "text-[#d8f36b]" : "text-[#858b98]"}>
              {answered ? "Answered" : "Awaiting your answer"}
            </span>
          </span>
        </button>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            aria-label="Question actions"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-1.5 text-[#858b98] transition-colors hover:bg-[#F1F1F11F] hover:text-[#f4f3ef]"
          >
            <RiMore2Fill className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1.5 w-40 rounded-xl border border-[#292d36] bg-[#171a21] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              <button
                onClick={() => deleteAction(question.id as string)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#f87171] transition-colors hover:bg-[#f871710d]"
              >
                <RiDeleteBinLine className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <AnswerForm
        isOpen={isOpen}
        setOpenQuestion={onToggle}
        question={question}
        questions={questions}
        setQuestions={setQuestions}
      />
    </div>
  );
};

export default QuestionCard;