import { Header, Pagination } from "@/components";
import Search from "@/components/Search";
import { getCreatorsByPage } from "@/lib/mongo/geCreatorsByPage";
import { CreatorsProp } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const CreatorsList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentPage = searchParams["page"] ?? "1";
  const perPage = 4;

  const start = (Number(currentPage) - 1) * perPage;
  const end = start + perPage;
  const { response, totalUsers, error } = await getCreatorsByPage(
    Number(currentPage),
    perPage
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (response?.length === 0) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="m-auto lg:w-2/3  min-h-[95vh]">
        <div className="flex px-2 justify-between py-4 items-center flex-wrap gap-4 border border-transparent border-y-slate-700">
          <p className=" grow font-bold text-2xl">Find Creators</p>
          <div className="grow bg-[#00000039] flex items-center">
            <Search />
          </div>
        </div>
        <div className="flex justify-start  px-2 lg:px-0 gap-2 my-4 items-center flex-wrap">
          {Array.isArray(response) &&
            response.map(({ id, name, profilePic, username }) => {
              return (
                <div
                  className="flex w-full md:w-[49.4%] overflow-ellipsis items-center gap-4 px-4 py-2  border border-slate-800"
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
        <Pagination
          perPage={perPage}
          totaUsers={totalUsers as number}
          hasNext={end < (totalUsers as number)}
          hasPrevious={start > 0}
        />
      </div>
    </>
  );
};

export default CreatorsList;
