"use client";

import { filterUsers } from "@/lib/helpers";
import { searchUsers } from "@/lib/mongo/searchUsers";
import { CreatorsProp } from "@/lib/types";
import { strict } from "assert";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { unknown } from "zod";


const Search = () => {
  const [query, setQuery] = useState("");
  const [visibleSuggestions, setVisibleSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CreatorsProp>([])


  useEffect(() => {
    if (query.trim() === "") {
      setVisibleSuggestions(false);
      return;
    } 

    const timerId = setTimeout(async () => {
        const response = await searchUsers(query)
        if('error' in response) {
          return toast.error(response.error);
        }
        setVisibleSuggestions(true);
        setSuggestions(response)
    }, 500)

    return () => clearTimeout(timerId);

  }, [query]);

  return (
    <div className="flex w-full relative justify-center items-center border-2 border-slate-500 gap-2 px-2 py-1 rounded">
      <CiSearch className="w-8 h-8"/>
      <input
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if(query.trim() === "") {
            return; 
          }
          setVisibleSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setVisibleSuggestions(false), 300);
        }}
        value={query}
        className="bg-transparent outline-none w-full py-1"
        placeholder="search by name or username"
        type="text"
      />

      <div className="absolute top-12 w-full rounded overflow-hidden">
        {visibleSuggestions &&
          suggestions.slice(0,10).map(({ name, username, id , profilePic}) => {
            return (
              <Link
                href={`/${username}`}
                key={id}
                className="flex hover:bg-gray-300 items-center gap-2 text-black bg-white p-2"
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
