"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded w-full px-4 py-2 my-2  text-black bg-white duration-200"
      type="submit"
    >
      {pending ? "Asking..." : "Ask a question"}
    </button>
  );
}
