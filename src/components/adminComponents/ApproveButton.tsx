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
      className="p-2 text-green-500 bg-slate-800 rounded"
      type="submit"
    >
      Approve
    </button>
  );
};

export default ApproveButton;
