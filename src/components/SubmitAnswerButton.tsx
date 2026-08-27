"use client";

import { useFormStatus } from "react-dom";

const SubmitAnswerButton = () => {
    const {pending} = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#d8f36b] px-4 py-2 text-sm font-semibold text-[#171b0a] transition-colors hover:bg-[#e4fa8a] disabled:cursor-wait disabled:opacity-60"
    >
          {pending ? "Submitting...":"Submit"}
    </button>
  )
}

export default SubmitAnswerButton