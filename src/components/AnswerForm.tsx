"use client";
import { useRef } from "react";
import { answerQuestion } from "@/app/actions/actions";
import SubmitAnswerButton from "./SubmitAnswerButton";
import { AnswerSchema } from "@/lib/types";
import toast from "react-hot-toast";

type AnswerFormProps = {
    toggleOpenState: (arg: number) => void;
    idx: number;
    questionId: string;
};

const AnswerForm = ({ toggleOpenState, idx, questionId }: AnswerFormProps) => {
    const ref = useRef<HTMLFormElement>(null);

    async function answerAction(formData: FormData) {
        const newAnswer = {
            questionId: questionId,
            answer : formData.get("answerText")
        }

        const result = AnswerSchema.safeParse(newAnswer)

        if(!result.success) {
            let errorMsg = "";
            result.error.format();
            result.error.issues.forEach((issue) => {
                errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
            });

            toast.error(errorMsg);
            return;
        }

        const response = await answerQuestion(result.data)
        if(response?.error) {
            toast.error(response.error)
            return;
        }
        ref.current?.reset()
        toast.success("Answer Submitted successfully!")
        toggleOpenState(idx)
    }

  return (
    <form  ref={ref} action={answerAction}>
      <textarea
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
