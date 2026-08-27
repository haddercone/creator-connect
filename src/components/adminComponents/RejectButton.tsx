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
      className="rounded-lg border border-[#3a404c] bg-transparent px-4 py-2 text-sm font-semibold text-[#f87171] transition-colors hover:border-[#f87171] hover:bg-[#f871710d]"
    >
      Reject
    </button>
  );
};

export default RejectQuestion;