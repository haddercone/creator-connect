"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="my-3 w-full rounded-lg bg-[#d8f36b] px-4 py-3 font-semibold text-[#171b0a] hover:bg-[#e4fa8a] disabled:cursor-wait disabled:opacity-60"
      type="submit"
      disabled={pending}
    >
      {pending ? "Asking..." : "Ask a question"}
    </button>
  );
}
