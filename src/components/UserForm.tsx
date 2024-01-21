"use client";

import { createQuestion } from "@/app/actions/actions";
import FormSubmitButton from "./FormSubmitButton";
import { useRef } from "react";
import { QuestionSchema } from "@/lib/types";
import toast from "react-hot-toast";

const UserForm = ({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName: string;
}) => {
  const ref = useRef<HTMLFormElement>(null);

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

    if (response?.error) {
      toast.error(response.error);
      return;
    }
    ref?.current?.reset();
    toast.success("Question sent successfully!");
  }

  return (
    <form ref={ref} action={clientAction}>
      <textarea
        placeholder={`Ask your question to ${recipientName}...`}
        className="rounded resize-none  min-h-48 max-h-48 outline-none p-2 bg-[#F1F1F11F] border-2 border-slate-900"
        name="question"
        cols={30}
        rows={5}
        required
      ></textarea>{" "}
      <br />
      <FormSubmitButton />
    </form>
  );
};

export default UserForm;
