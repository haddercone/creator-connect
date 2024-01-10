"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type ButtonProps = {
  provider:"string";
  icon : any;
}

const LoginButton = ({provider, icon}: ButtonProps ) => { 
  const router = useRouter();
  console.log("Rounter", router);
  
  return (
    <button
      onClick={() =>
        signIn(provider, { callbackUrl: "/dashboard", redirect: true })
      }
      className="bg-white rounded my-4 text-black px-4 py-2 flex justify-center w-full items-center gap-4"
    >
      <span>{icon}</span>
      <span>Login with {provider}</span>
    </button>
  )
}

export default LoginButton