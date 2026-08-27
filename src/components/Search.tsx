"use client";

import { searchUsers } from "@/lib/mongo/searchUsers";
import { CreatorsProp } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";

function highlight(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <span className="text-[#d8f36b]">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}

const SearchLoading = () => (
  <div className="bg-[#171a21] px-3 py-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 py-2">
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#292d36]" />
        <div className="space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-[#292d36]" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-[#292d36]" />
        </div>
      </div>
    ))}
  </div>
);

const Search = () => {
  const [query, setQuery] = useState("");
  const [visibleSuggestions, setVisibleSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CreatorsProp>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    setSuggestions([]);

    if (trimmed === "") {
      setVisibleSuggestions(false);
      setIsSearching(false);
      return;
    }

    setVisibleSuggestions(true);
    setIsSearching(true);

    const timerId = setTimeout(async () => {
      const response = await searchUsers(trimmed);
      setIsSearching(false);
      if ("error" in response) {
        return toast.error(response.error);
      }
      setSuggestions(response);
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  const visibleResults = suggestions.slice(0, 10);

  return (
    <div className="relative flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a404c] bg-[#111318] px-3 py-2 focus-within:border-[#d8f36b]">
      <CiSearch className="h-6 w-6 text-[#858b98]" />
      <input
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim() === "") {
            return;
          }
          setVisibleSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setVisibleSuggestions(false), 300);
        }}
        value={query}
        className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-[#858b98]"
        placeholder="Search by name or username"
        type="text"
      />

      {visibleSuggestions && !isSearching && visibleResults.length === 0 && (
        <div className="absolute top-12 z-20 w-full overflow-hidden rounded-xl border border-[#292d36] bg-[#171a21] shadow-2xl">
          <div className="flex items-center gap-3 px-4 py-4">
            <CiSearch className="h-5 w-5 shrink-0 text-[#858b98]" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#f4f3ef]">
                No creators found
              </p>
              <p className="truncate text-xs text-[#858b98]">
                Nothing matches &ldquo;{query.trim()}&rdquo;. Try another name.
              </p>
            </div>
          </div>
        </div>
      )}

      {visibleSuggestions && (isSearching || visibleResults.length > 0) && (
        <div className="absolute top-12 z-20 w-full overflow-hidden rounded-xl border border-[#292d36] shadow-2xl">
          {isSearching ? (
            <SearchLoading />
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-[#292d36] bg-[#111318] px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#858b98]">
                  Creators
                </span>
                <span className="text-xs text-[#858b98]">
                  {visibleResults.length}{" "}
                  {visibleResults.length === 1 ? "match" : "matches"}
                </span>
              </div>
              {visibleResults.map(({ name, username, id, profilePic }) => {
                return (
                  <Link
                    href={`/${username}`}
                    key={id}
                    className="group flex items-center gap-3 bg-[#171a21] px-3 py-2.5 text-sm text-[#f4f3ef] hover:bg-[#242933]"
                  >
                    <Image
                      src={profilePic}
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#3a404c]"
                      alt={name}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {highlight(name, query.trim())}
                      </p>
                      <p className="truncate text-xs text-[#858b98]">
                        @{highlight(username, query.trim())}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;