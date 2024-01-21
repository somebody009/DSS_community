/* eslint-disable no-unused-vars */
"use server";

// TODO : Write code of this file again

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import { model } from "mongoose";

// List of searchable types
const SearchableTypes = ["question", "user", "answer", "tag"];

// Define the function for global search
export async function globalSearch(params: SearchParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Destructure the query and type from the params
    const { query, type } = params;

    // Create a regex query object for case-insensitive search
    const regexQuery = { $regex: query, $options: "i" };

    // Initialize an empty array for the results
    let results = [];

    // Define an array of models and their search fields and types
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    // Convert the type to lowercase if it exists
    const typeLower = type?.toLowerCase();

    // If the type is not provided or is not in the searchable types array, search across all models
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        // Map the query results to the format required for the results array
        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answer Containing ${query}`
                : item[item.searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      // Search a specific type of model
      const modeInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modeInfo) {
        // If model info is not found, throw an error
        throw new Error("Invalid search type");
      }

      const queryResults = await modeInfo.model
        .find({
          [modeInfo.searchField]: regexQuery,
        })
        .limit(8);

      // Map the query results to the format required for the results array
      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answer Containing ${query}`
            : item[modeInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }

    // Return the results as a JSON string
    return JSON.stringify(results);
  } catch (error) {
    // Log the error
    console.log(`Error Fetching Global Result, ${error}`);

    // Throw the error
    throw error;
  }
}
