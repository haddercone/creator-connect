import { ImGithub } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import LoginButton from "@/components/LoginButton";

const loginButtonConfig = [
  { provider: "twitter", icon: <FaXTwitter /> },
  { provider: "github", icon: <ImGithub /> },
];

const page = () => {
  return (
    <section className=" bg-slate-900 flex justify-center items-center min-h-screen flex-col gap-4">
      <div className="relative lg:w-1/4 text-center">
        <p className="before:absolute before:left-0 text-white before:h-[1px] lg:before:w-16 before:bg-white before:top-[0.7rem] after:absolute after:right-0 after:h-[1px] lg:after:w-16 after:bg-white after:top-[0.7rem]">
          Log in to Creator Connect
        </p>
      </div>

      <div className=" bg-[#FFFFFF1F] rounded px-10 py-5 lg:w-1/4">
        {loginButtonConfig.map((config) => {
          const { provider, icon } = config;
          return <LoginButton key={provider} provider={provider} icon={icon} />;
        })}
      </div>
    </section>
  );
};

export default page;
