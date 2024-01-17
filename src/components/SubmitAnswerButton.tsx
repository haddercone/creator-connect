"use client";

import { useFormStatus } from "react-dom";

const SubmitAnswerButton = () => {
    const {pending} = useFormStatus();
  return (
    <button type="submit" className="px-4 py-1 bg-green-600 rounded">
          {pending ? "Submitting...":"Submit"}
    </button>
  )
}

export default SubmitAnswerButton