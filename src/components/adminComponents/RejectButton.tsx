"use client";

import { rejectQuestion } from "@/lib/mongo/rejectQuestion";
import toast from "react-hot-toast";

const RejectQuestion = ({ id }: { id: string }) => {
  async function handleReject() {
    const response = await rejectQuestion(id);

    if ("error" in response) {
      toast.error("Error while rejecting");
      return;
    }
    toast.success(`Rejected successfully!`);
  }
  return (
    <button
      onClick={handleReject}
      type="submit"
      className="bg-slate-800 p-2 text-red-500 rounded"
    >
      Reject
    </button>
  );
};

export default RejectQuestion;
