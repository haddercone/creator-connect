"use client";

import { useRef, useState } from "react";
import { answerQuestion, updateAnswer } from "@/app/actions/actions";
import SubmitAnswerButton from "./SubmitAnswerButton";
import { Answer, AnswerSchema } from "@/lib/types";
import toast from "react-hot-toast";

type AnswerFormProps = {
  toggleOpenState: (arg: number) => void;
  idx: number;
  questionId: string;
  answer: Answer | null;
};

const AnswerForm = ({
  toggleOpenState,
  idx,
  questionId,
  answer,
}: AnswerFormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [answerText, setAnswerText] = useState<string>(answer?.answer ?? "");
  const inputRef = useRef<string>(answerText);

  async function answerAction(formData: FormData) {
    const newAnswer = {
      questionId: questionId,
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

    ref.current?.reset();
    toggleOpenState(idx);
  }

  return (
    <form ref={ref} action={answerAction}>
      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        name="answerText"
        className="w-full resize-none max-h-20 min-h-20 outline-none border border-transparent py-1 px-2 bg-[#F1F1F11F] rounded"
        required
      ></textarea>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => toggleOpenState(idx)}
          className="px-4 py-1 bg-red-600 rounded"
        >
          Cancel
        </button>
        <SubmitAnswerButton />
      </div>
    </form>
  );
};

export default AnswerForm;
