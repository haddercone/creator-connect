"use client";

import { filterUsers } from "@/lib/helpers";
import { CreatorsProp } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

const Search = ({ creators }: { creators: CreatorsProp }) => {
  const [query, setQuery] = useState("");
  const [usersVisible, setUsersVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<CreatorsProp>([])


  useEffect(() => {
    if (query === "") {
      setUsersVisible(false);
      return;
    } 

    const timerId = setTimeout(() => {
        const data = filterUsers(creators as CreatorsProp , query)
        setUsersVisible(true);
        setSuggestions(data)
    }, 300)

    return () => clearTimeout(timerId);

  }, [query]);

  return (
    <div className="flex w-full relative justify-center items-center border-2 border-slate-500 gap-2 px-2 py-1 rounded">
      <CiSearch />
      <input
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setUsersVisible(true);
        }}
        onBlur={() => {
          setTimeout(() => setUsersVisible(false), 300);
        }}
        value={query}
        className="bg-transparent outline-none w-full"
        placeholder="search by name or username"
        type="text"
      />

      <div className="absolute top-10 w-full">
        {usersVisible &&
          suggestions.slice(0,10).map(({ name, username, id , profilePic}) => {
            return (
              <Link
                href={`/${username}`}
                key={id}
                className="flex items-center gap-2 text-black bg-white p-2 rounded"
              >
            <span>
                <Image src={profilePic} width={20} height={20} className="rounded" alt={name}  />
            </span>
                <span>{name}</span>
                <span className="text-gray-400">@{username}</span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Search;