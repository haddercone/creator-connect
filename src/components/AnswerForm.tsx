"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { answerQuestion, updateAnswer } from "@/app/actions/actions";
import SubmitAnswerButton from "./SubmitAnswerButton";
import { Answer, AnswerSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { Question } from "@/app/dashboard/types";

type AnswerFormProps = {
  toggleOpenState: (arg: number) => void;
  idx: number;
  question: Question;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
};

const AnswerForm = ({
  toggleOpenState,
  idx,
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

    toggleOpenState(idx);
  }

  return (
    <form action={answerAction}>
      <textarea
        value={answerText}
        placeholder="Your answer here..."
        onChange={(e) => setAnswerText(e.target.value)}
        name="answerText"
        className="w-full resize-none max-h-20 min-h-20 outline-none border border-transparent py-1 px-2 bg-[#F1F1F11F] rounded"
        required
      ></textarea>
      <div className="flex mt-2 justify-end gap-2">
        <button
          type="button"
          onClick={() => toggleOpenState(idx)}
          className="px-4 py-1 bg-slate-800 text-red-500 rounded"
        >
          Cancel
        </button>
        <SubmitAnswerButton />
      </div>
    </form>
  );
};

export default AnswerForm;
