"use client";

import { createQuestion } from "@/app/actions/actions";
import FormSubmitButton from "./FormSubmitButton";
import { CiCircleInfo } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { QuestionSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { getLastSuccessfullQuestionsTimeStamp } from "@/lib/helpers";

const UserForm = ({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName: string;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  const [timeStamp, setTimeStamp] = useState("");
  const timestampStorageKey = `lastQuestionTimestamp:${recipientId}`;

  useEffect(() => {
    setTimeStamp(localStorage.getItem(timestampStorageKey) ?? "");
  }, [timestampStorageKey]);

  async function clientAction(formData: FormData) {
    const newQuestion = {
      recipientId: recipientId,
      question: formData.get("question"),
    };
    const result = QuestionSchema.safeParse(newQuestion);
    if (!result.success) {
      let errorMsg = "";
      result.error.format();
      result.error.issues.forEach((issue) => {
        errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
      });

      toast.error(errorMsg);
      return;
    }

    const response = await createQuestion(result.data);

    if (response === undefined) {
      toast.error(
        `Your question limit of 2 questions/hr exceeded. Try again after some time.`
      );
      ref?.current?.reset();
      return;
    }

    if ((response as { error?: string })?.error) {
      toast.error((response as { error: string })?.error);
      return;
    }
    const timestamp = getLastSuccessfullQuestionsTimeStamp();
    localStorage.setItem(timestampStorageKey, timestamp);
    setTimeStamp(timestamp);

    ref?.current?.reset();
    toast("Your question is under review, and the creator will respond upon completion.", {
      style: {backgroundColor: "#40A2E3", color: "white"},
    })
    
  }

  return (
    <form ref={ref} action={clientAction}>
      <textarea
        placeholder={`Ask your question to ${recipientName}...`}
        className="min-h-44 w-full resize-none rounded-xl border border-[#3a404c] bg-[#0a0b0d] p-4 leading-7 outline-none placeholder:text-[#858b98] focus:border-[#d8f36b]"
        name="question"
        cols={30}
        rows={5}
        required
      ></textarea>{" "}
      <FormSubmitButton />
      {timeStamp && (
        <p className="text-xs text-[#858b98]">Last asked at {timeStamp}</p>
      )}
      <div className="my-3 flex items-start gap-2 rounded-lg border border-[#292d36] bg-[#171a21] px-3 py-2 text-[#858b98]">
        <span className="mt-0.5 text-lg text-[#d8f36b]">
          <CiCircleInfo />
        </span>
        <span className="text-xs leading-5">
          Two questions per hour, per creator.
        </span>
      </div>
    </form>
  );
};

export default UserForm;
