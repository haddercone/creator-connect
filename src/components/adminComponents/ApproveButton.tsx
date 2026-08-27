"use client";

import { approveQuestion } from "@/lib/mongo/approveQuestion";
import toast from "react-hot-toast";

const ApproveButton = ({ id }: { id: string }) => {
  async function handleApprove() {
    const response = await approveQuestion(id);

    if ("error" in response) {
      toast.error("Error while approving");
      return;
    }
    toast.success(`Approved!`);
  }
  return (
    <button
      onClick={handleApprove}
      type="submit"
      className="rounded-lg bg-[#d8f36b] px-4 py-2 text-sm font-semibold text-[#171b0a] transition-colors hover:bg-[#e4fa8a]"
    >
      Approve
    </button>
  );
};

export default ApproveButton;