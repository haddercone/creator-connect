"use client";

import { deleteQuestion } from "@/app/actions/actions";
import { Question } from "@/app/dashboard/types";
import { useClickOutside } from "@/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { RiChat1Line, RiDeleteBinLine, RiMore2Fill } from "react-icons/ri";
import toast from "react-hot-toast";

type QuestionCardProps = {
  question: Question;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  onOpen: () => void;
};

const QuestionCard = ({
  question,
  questions,
  setQuestions,
  onOpen,
}: QuestionCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside(
    () => setMenuOpen(false)
  ) as React.RefObject<HTMLDivElement>;

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
    <div className="rounded-2xl border border-[#292d36] bg-[#0a0b0d] transition-colors hover:border-[#d8f36b33]">
      <div className="flex items-start justify-between gap-3 p-4">
        <button
          type="button"
          onClick={onOpen}
          title="Answer this question"
          className="min-w-0 grow cursor-pointer rounded-lg text-left"
        >
          <p className="min-w-0 leading-6 text-[#f4f3ef]">
            {question.questionText}
          </p>
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
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d8f36b]">
            <RiChat1Line className="h-3.5 w-3.5" />
            {answered ? "Update answer" : "Answer"}
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
    </div>
  );
};

export default QuestionCard;