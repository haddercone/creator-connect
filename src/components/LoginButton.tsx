"use client";
import { signIn } from "next-auth/react";
import type { ReactNode } from "react";

const providerLabels: Record<string, string> = {
  github: "GitHub",
  twitter: "X",
};

type ButtonProps = {
  provider: string;
  icon: ReactNode;
};

const LoginButton = ({ provider, icon }: ButtonProps) => {
  const label = providerLabels[provider] ?? provider;

  return (
    <button
      onClick={() =>
        signIn(provider, { callbackUrl: "/dashboard", redirect: true })
      }
      className="flex w-full items-center justify-center gap-4 rounded-xl border border-[#3a404c] bg-[#171a21] px-4 py-3 text-sm font-semibold text-[#f4f3ef] hover:border-[#d8f36b] hover:bg-[#111318] hover:text-[#d8f36b]"
    >
      <span className="text-lg">{icon}</span>
      <span>Continue with {label}</span>
    </button>
  );
};

export default LoginButton;