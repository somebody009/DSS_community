"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

// Function to retrieve a user by ID
export async function getUserById(params: any) {
  try {
    connectToDatabase(); // Connect to the database

    const { userId } = params; // Extract userId from the params

    const user = await User.findOne({ clerkId: userId }); // Find the user by clerkId

    return user; // Return the user
  } catch (error) {
    console.log(error); // Log any errors
    throw error; // Throw the error
  }
}

// Function to create a new user
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase(); // Connect to the database

    const newUser = await User.create(userData); // Create a new user with the provided data

    return newUser; // Return the new user
  } catch (error) {
    console.log(error); // Log any errors
    throw error; // Throw the error
  }
}

// Function to update a user's information
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase(); // Connect to the database

    const { clerkId, updateData, path } = params; // Extract clerkId, updateData, and path from the params

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true, // Find and update the user, returning the updated user
    });

    revalidatePath(path); // Revalidate the specified path
  } catch (error) {
    console.log(error); // Log any errors
    throw error; // Throw the error
  }
}

// Function to delete a user
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase(); // Connect to the database

    const { clerkId } = params; // Extract clerkId from the params

    const user = await User.findOneAndDelete({ clerkId }); // Find and delete the user by clerkId

    if (!user) {
      throw new Error("User not found"); // If user is not found, throw an error
    }
    // Delete user's questions, answers, comments, etc.
    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser; // Return the deleted user
  } catch (error) {
    console.log(error); // Log any errors
    throw error; // Throw the error
  }
}

// Function to get all users based on specified parameters
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase(); // Connect to the database

    const { searchQuery, filter, page = 1, pageSize = 5 } = params; // Extract searchQuery, filter, page, and pageSize from the params

    const skipAmount = (page - 1) * pageSize; // Calculate the amount to skip based on page and pageSize

    const query: FilterQuery<typeof User> = {}; // Create an empty query object

    // Add search query to the filter if provided

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") }, // Search by name
        },
        {
          username: { $regex: new RegExp(searchQuery, "i") }, // Search by username
        },
      ];
    }

    let sortOptions = {}; // Create an empty object for sort options
    // Set sort options based on filter
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 }; // Sort by joinedAt in descending order
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 }; // Sort by joinedAt in ascending order
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 }; // Sort by reputation in descending order
        break;

      default: // For default case, keep sortOptions empty
        break;
    }
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find(query) // Find users based on the query
      .sort(sortOptions) // Sort the users based on sortOptions
      .skip(skipAmount) // Skip the specified amount
      .limit(pageSize); // Limit the number of results

    const totalUsers = await User.countDocuments(query); // Count the total number of users based on the query

    // Check if there are more users to retrieve from the database
    const isNext = totalUsers > skipAmount + users.length;
    // Return the retrieved users and the flag indicating if there are more users

    return { users, isNext };
  } catch (error) {
    // Log the error to the console
    console.log(error);
    // Rethrow the error to propagate it up the call stack
    throw error;
  }
}
/**
 * Toggles the save state of a question for a user.
 * @param {ToggleSaveQuestionParams} params - The parameters for toggling the save state.
 */
export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    // Connect to the database
    connectToDatabase();

    // Destructure parameters
    const { userId, questionId, path } = params;

    // Find the user by userId
    const user = await User.findById(userId); // Throw error if user not found

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId); // Check if the question is already saved

    // Toggle save state based on current state
    if (isQuestionSaved) {
      // remove question from saved
      // If question is already saved, remove it from saved

      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      // If question is not saved, add it to saved

      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    // const totalUsers = await User.countDocuments(query);

    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    // Repetutation
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNextQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNextAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
