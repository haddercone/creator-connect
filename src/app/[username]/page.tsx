"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCreatorPageDetails } from "../actions/actions";
import { UserProps, Username } from "./types";
import Image from "next/image";
import UserForm from "@/components/UserForm";

const UserPage = () => {
  const params = useParams();
  const username: Username = params.username;
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<UserProps>({});

  
  useEffect(() => {
    async function getUserData() {
      const recipentDetails = await getCreatorPageDetails({ username });
      
      if (!recipentDetails) {
        
      } else {
        setRecipient(recipentDetails);
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
            <Image draggable={false} width={200} height={200} className="w-40 h-40 rounded-full" src={recipient?.profilePic as string} alt="user_profile" />
            <p className="text-4xl font-bold">{recipient?.name}</p>  
          </div>

          <div className="flex justify-center items-center flex-col gap-5 ">
            <p>Ask your question to {recipient?.name}</p>
            <UserForm recipientId={recipient?.id as string} recipientName={recipient?.name as string}/>
          </div>
        </div>
      )}
      </section>
    </>
  );
};

export default UserPage;
