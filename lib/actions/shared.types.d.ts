import { Schema } from "mongoose";

import { IUser } from "@/mongodb";
/**
 * Parameters for creating an answer
 */
export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

/**
 * Parameters for getting answers
 */
export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Parameters for voting on an answer
 */
export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

/**
 * Parameters for deleting an answer
 */
export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

/**
 * Parameters for searching
 */
export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

/**
 * Parameters for getting recommended items
 */
export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

/**
 * Parameters for viewing a question
 */
export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

/**
 * Parameters for filtering jobs
 */
export interface JobFilterParams {
  query: string;
  page: string;
}

/**
 * Parameters for getting questions
 */
export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

/**
 * Parameters for creating a question
 */
export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

/**
 * Parameters for getting a question by ID
 */
export interface GetQuestionByIdParams {
  questionId: string;
}

/**
 * Parameters for voting on a question
 */
export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

/**
 * Parameters for deleting a question
 */
export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

/**
 * Parameters for editing a question
 */
export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

/**
 * Parameters for getting all tags
 */
export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

/**
 * Parameters for getting questions by tag ID
 */
export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

/**
 * Parameters for getting top interacted tags
 */
export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

/**
 * Parameters for creating a user
 */
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

/**
 * Parameters for getting a user by ID
 */
export interface GetUserByIdParams {
  userId: string;
}

/**
 * Parameters for getting all users
 */
export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

/**
 * Parameters for updating a user
 */
export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

/**
 * Parameters for toggling save on a question
 */
export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

/**
 * Parameters for getting saved questions
 */
export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

/**
 * Parameters for getting user stats
 */
export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

/**
 * Parameters for deleting a user
 */
export interface DeleteUserParams {
  clerkId: string;
}
