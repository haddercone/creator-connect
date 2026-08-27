import { ImGithub } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import LoginButton from "@/components/LoginButton";
import Link from "next/link";

const loginButtonConfig = [
  { provider: "twitter", icon: <FaXTwitter /> },
  { provider: "github", icon: <ImGithub /> },
];

const SignInPage = () => {
  return (
    <section className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#292d36] bg-[#111318] p-8 text-center">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#d8f36b0d]" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d8f36b] text-2xl font-black text-[#171b0a]">
            C
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8f36b]">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#f4f3ef]">
            Continue the conversation.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#858b98]">
            Sign in to manage your questions and answers.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {loginButtonConfig.map((config) => {
              const { provider, icon } = config;
              return (
                <LoginButton key={provider} provider={provider} icon={icon} />
              );
            })}
          </div>

          <p className="mt-8 text-xs leading-5 text-[#5b616d]">
            New accounts are created automatically when you sign in for the first
            time.
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-[#858b98] hover:text-[#d8f36b]"
      >
        &larr; Back to home
      </Link>
    </section>
  );
};

export default SignInPage;
