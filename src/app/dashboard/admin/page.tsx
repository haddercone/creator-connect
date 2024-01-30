import ApproveButton from "@/components/adminComponents/ApproveButton";
import RejectButton from "@/components/adminComponents/RejectButton";
import { useServerSession } from "@/hooks";
import { getAllQuestions } from "@/lib/mongo/getAllQuestions";
import { redirect } from "next/navigation";

const AdminDashBoard = async () => {
  const session = await useServerSession()
  
  if(session?.user.role !== "admin"){
    redirect("/dashboard")
  }

  const allQuestions = await getAllQuestions();

  if ("error" in allQuestions) {
    return <p>{allQuestions.error}</p>;
  }

  if (allQuestions.length === 0) {
    return <div>
      <p className="text-center font-bold text-2xl  py-4 bg-slate-700">
        Admin Dashboard
      </p>
      <div className="text-center py-3 min-h-[90vh] text-2xl text-slate-500 flex justify-center items-center">No Pending questions</div>
    </div>;
  }

  return (
    <div>
      <p className="text-center font-bold text-2xl  py-4 bg-slate-700">
        Admin Dashboard
      </p>
      <div className=" my-4 min-h-screen">
        <div className="md:w-1/2 w-full  md:mx-auto md:rounded bg-slate-600 px-4 py-2">
        {allQuestions.map(({ id, questionText }) => {
          return (
            <div key={id} className="bg-slate-900 p-2 rounded my-2 flex gap-2 justify-between items-center flex-wrap">
              <p>{questionText}</p>
              <div className="flex gap-2 flex-wrap justify-center items-center">
                <ApproveButton id={id as string}/>
                <RejectButton id={id as string}/>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};


export default AdminDashBoard;