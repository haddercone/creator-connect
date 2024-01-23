"use client";

import { createQuestion } from "@/app/actions/actions";
import FormSubmitButton from "./FormSubmitButton";
import { CiCircleInfo } from "react-icons/ci";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QuestionSchema } from "@/lib/types";
import toast from "react-hot-toast";
import { ALLOWED_REQUESTS, RATE_LIMIT_VALUE_SECONDS } from "@/config/rateLimit";

const UserForm = ({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName: string;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  const [responseData, setResponseData] = useState({});

  useEffect(() => {
    let timeId: NodeJS.Timeout;
    if (responseData === undefined && !localStorage.getItem("lastErrorTimeStamp")) {
      
      localStorage.setItem("lastErrorTimeStamp", Date.now().toString());

      timeId = setTimeout(() => {
        localStorage.removeItem("lastErrorTimeStamp");
      }, RATE_LIMIT_VALUE_SECONDS * 60 * 1000);
    }

    return () => clearTimeout(timeId);
  }, [responseData]);

  const getTimeDifferences = useCallback(
    (currentTimeStamp: number, lastErrorTimeStamp: number) => {
      const standardDifference = Math.floor(
        (RATE_LIMIT_VALUE_SECONDS * 60) / 60
      );

      if (lastErrorTimeStamp === 0) {
        return standardDifference;
      }

      const timeDifference =
        standardDifference -
        Math.max(
          0,
          Math.ceil((currentTimeStamp - lastErrorTimeStamp) / (1000 * 60))
        );

      return timeDifference;
    },
    []
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
    
    setResponseData(response);

    if (response === undefined) {
      const currenTimeStamp = Date.now();
      const lastErrorTimeStamp = Number(localStorage.getItem("lastErrorTimeStamp"));
      const timeDiff = getTimeDifferences(currenTimeStamp, lastErrorTimeStamp);
      toast.error(
        `Your question limit exceeded. Try again after ${timeDiff} minutes.`
      );

      ref?.current?.reset();
      return;
    }

    if ((response as { error?: string })?.error) {
      toast.error((response as { error: string })?.error);
      return;
    }
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
      <div className="bg-blue-700 py-2 px-4 flex justify-start items-center gap-2 rounded my-2">
        <span className="text-xl">
          <CiCircleInfo />
        </span>
        <span className="text-xs">
          Please note you can only ask {ALLOWED_REQUESTS} questions/hr,to prevent spamming.{" "}
        </span>
      </div>
    </form>
  );
};

export default UserForm;
