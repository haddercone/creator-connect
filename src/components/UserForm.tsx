"use client";

import { createQuestion } from "@/app/actions/actions";
import FormSubmitButton from "./FormSubmitButton";
import { CiCircleInfo } from "react-icons/ci";
import { useRef, useState } from "react";
import { QuestionSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { ALLOWED_REQUESTS } from "@/config/rateLimit";
import { getLastSuccessfullQuestionsTimeStamp } from "@/lib/helpers";

const UserForm = ({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName: string;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  const [timeStamp, setTimeStamp] = useState(
    localStorage.getItem("timeStamp") ?? ""
  );

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
    localStorage.setItem("timeStamp", timestamp);
    setTimeStamp(timestamp);

    ref?.current?.reset();
    toast.success("Question sent successfully!");
  }

  return (
    <form ref={ref} action={clientAction}>
      <textarea
        placeholder={`Ask your question to ${recipientName}...`}
        className="rounded w-full resize-none  min-h-48 max-h-48 outline-none p-2 bg-[#F1F1F11F] border-2 border-slate-900"
        name="question"
        cols={30}
        rows={5}
        required
      ></textarea>{" "}
      <br />
      <FormSubmitButton />
      {timeStamp && (
        <p className="text-sm">Last questions asked at {timeStamp}</p>
      )}
      <div className="bg-blue-700 py-2 px-4 flex justify-start items-center gap-2 rounded my-2">
        <span className="text-xl">
          <CiCircleInfo />
        </span>
        <span className="text-xs">
          Please note, to prevent spamming, you are only allowed to ask 2 questions per hour.
        </span>
      </div>
    </form>
  );
};

export default UserForm;
