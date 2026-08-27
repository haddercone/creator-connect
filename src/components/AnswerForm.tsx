"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { answerQuestion, updateAnswer } from "@/app/actions/actions";
import SubmitAnswerButton from "./SubmitAnswerButton";
import { Answer, AnswerSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { Question } from "@/app/dashboard/types";

type AnswerFormProps = {
  setOpenQuestion: () => void;
  isOpen: boolean;
  question: Question;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
};

const AnswerForm = ({
  setOpenQuestion,
  isOpen,
  question,
  questions,
  setQuestions,
}: AnswerFormProps) => {
  const [answerText, setAnswerText] = useState<string>(
    question.answer?.answer ?? ""
  );
  const inputRef = useRef<string>(answerText); // to keep track of initial answer text
  const [questionState, setQuestionState] = useState<Question>(question);

  useEffect(() => {
    setQuestionState((prev) => ({
      ...prev,
      answer: { ...(prev.answer as Answer), answer: answerText },
    }));
  }, [answerText]);

  async function answerAction(formData: FormData) {
    const newAnswer = {
      questionId: question.id,
      answer: answerText,
    };

    const result = AnswerSchema.safeParse(newAnswer);

    if (!result.success) {
      let errorMsg = "";
      result.error.format();
      result.error.issues.forEach((issue) => {
        errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
      });

      toast.error(errorMsg);
      return;
    }
    // if the answer was not changed and the user tries to submit the same answer again
    if(inputRef.current === answerText) {
      toast.error("Please update answer before Submission")
      return;
    }
    
    // if question is new and there is no answer e.g answer is an empty string create a new answer
    if (inputRef.current === "") {
      const response = await answerQuestion(result.data);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Answer Submitted successfully!");
    } else {
      // if there is a previous answer update the answer
      const updateResponse = await updateAnswer(result.data);
      if (updateResponse?.error) {
        toast.error(updateResponse.error);
        return;
      }
      toast.success("Answer Updated successfully!");
    }

    const updatedQuestions = questions.map((question) =>
      question.id === questionState.id ? questionState : question
    );

    setQuestions(updatedQuestions);
    setOpenQuestion()
  }

  return (
    isOpen && (
      <form action={answerAction} className="flex flex-col">
        <textarea
          value={answerText}
          placeholder="Your answer here..."
          onChange={(e) => setAnswerText(e.target.value)}
          name="answerText"
          className="min-h-20 w-full resize-none rounded-xl border border-[#3a404c] bg-[#111318] p-4 text-sm leading-6 text-[#f4f3ef] outline-none placeholder:text-[#858b98] focus:border-[#d8f36b]"
          required
        ></textarea>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpenQuestion()}
            className="rounded-lg border border-[#3a404c] px-4 py-2 text-sm font-medium text-[#858b98] transition-colors hover:border-[#f87171] hover:text-[#f87171]"
          >
            Cancel
          </button>
          <SubmitAnswerButton />
        </div>
      </form>
    )
  );
};

export default AnswerForm;
