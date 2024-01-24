// Import necessary modules and components
"use client";
import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

// Define the GlobalResult functional component
const GlobalResult = () => {
  // Get search parameters from the URL
  const searchParmas = useSearchParams();

  // Initialize state variables
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  // Get global and type parameters from the search parameters
  const global = searchParmas.get("global");
  const type = searchParmas.get("type");

  // Fetch results when global or type changes
  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        // Perform global search using the globalSearch function
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) {
      fetchResult();
    }
  }, [global, type]);

  // Function to determine the link based on the item type
  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  // Render the GlobalResult component
  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <p className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </p>
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          // Show loading indicator if data is being fetched
          <div className="flex-center flex-col px-5 ">
            <ReloadIcon className="my-2 size-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing The Entire Database
            </p>
          </div>
        ) : (
          // Render search results if not loading
          <div className="flex flex-col gap-2 ">
            {result.length > 0 ? (
              // Map through the results and render each item with a link
              result.map((item: any, index: number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                >
                  <Image
                    src={"/assets/icons/tag.svg"}
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col ">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium  mt-2 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              // Show no result message if there are no results
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no result Found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the GlobalResult component
export default GlobalResult;
