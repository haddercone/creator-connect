"use client";

import { clientSession } from "../auth/clientSession";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter, redirect } from "next/navigation";
import getCreatorPageDetails from "../actions/actions";
import { UserProps, Username } from "./types";

const page = () => {
  const params = useParams();
  const username: Username = params.username;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProps>({});
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const userDetails = await getCreatorPageDetails({ username });
      if (!userDetails) {
        router.push("/");
      } else {
        setUser(userDetails);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* <p>{user && JSON.stringify(user, null, 2)}</p> */}
      <section className="mt-2 flex bg-[#F1F1F1] items-center">
      {loading ? <p>Loading...</p> : (
        <div className="flex gap-4 p-2 justify-center items-center">
          <img draggable={false} className="w-40 h-40 rounded-full" src={user?.profilePic as string} alt="" />
          <p className="text-4xl font-bold">{user?.name}</p>  
        </div>
      )}
      </section>
    </>
  );
};

export default page;
