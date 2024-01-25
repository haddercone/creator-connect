import { Header } from "@/components";
import Search from "@/components/Search";
import { getCreaorsList } from "@/lib/mongo/getCreatorsList";
import Image from "next/image";
import Link from "next/link";

const CreatorsList = async () => {
  const creators = await getCreaorsList();

  if ("error" in creators) {
    return <div>Error: {creators.error}</div>;
  }

  if (creators.length === 0) {
    return <div>No Creator Found</div>;
  }

  return (
    <>
      <Header />
      <div className="m-auto lg:w-2/3  min-h-[95vh]">
        <div className="flex px-2 justify-between py-4 items-center flex-wrap gap-4 border border-transparent border-y-slate-700">
          <p className=" grow font-bold text-2xl">Find Creators</p>
          <div className="grow bg-[#00000039] flex items-center">
            <Search creators={creators} />
          </div>
        </div>
        <div className="flex justify-start px-2 lg:px-0 items-center gap-2 my-4 flex-wrap">
          {Array.isArray(creators) &&
            creators.map(({ id, name, profilePic, username }) => {
              return (
                <div
                  className="flex grow lg:w-1/2 max-w-96 overflow-ellipsis lg:grow-0 items-center gap-4 px-4 py-2  border border-slate-800"
                  key={id}
                >
                  <Image
                    className="rounded-full"
                    src={profilePic}
                    alt="profile_pic"
                    width={80}
                    height={80}
                  />

                  <div>
                    <p>
                      <Link
                        href={`/${username}`}
                        className="font-bold hover:underline"
                      >
                        {name}
                      </Link>
                    </p>
                    <span className="text-xs text-slate-600">@{username}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CreatorsList;
