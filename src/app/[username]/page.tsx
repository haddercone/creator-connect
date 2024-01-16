"use client";

import { clientSession } from "../auth/clientSession";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCreatorPageDetails , createQuestion} from "../actions/actions";
import { UserProps, Username } from "./types";


const page : React.FC = () => {
  const params = useParams();
  const username: Username = params.username;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProps>({});

  useEffect(() => {
    async function getUserData() {
      const userDetails = await getCreatorPageDetails({ username });
      // console.log(userDetails);
      
      if (!userDetails) {

          // notFound()
      } else {
        setUser(userDetails);
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  return (
    <>
      <section className=" min-h-screen flex flex-col justify-center items-center bg-gray-900  text-white ">
      {loading ? <p>Loading...</p> : (
        <div className="bg-[#00000039] py-2 px-4 rounded my-2">
          <div className="flex gap-5 p-2 flex-col justify-center items-center">
            <img draggable={false} className="w-40 h-40 rounded-full" src={user?.profilePic as string} alt="" />
            <p className="text-4xl font-bold">{user?.name}</p>  
          </div>

          <div className="flex justify-center items-center flex-col gap-5 ">
            <p>Ask your question to {user?.name}</p>
            <form action={async formData => await createQuestion(formData, user)}>
              <textarea  placeholder={`Ask your question to ${user?.name}...`} className="rounded  min-h-48 max-h-48 outline-none p-2 bg-[#FFFFFF39] border-2 border-slate-900" name="question" cols={30} rows={5}></textarea> <br />
              <button className="rounded w-full px-4 py-2 my-2  text-black bg-white duration-200" type="submit">
                Ask your question
              </button>
            </form>
          </div>
        </div>
      )}
      </section>
    </>
  );
};

export default page;
