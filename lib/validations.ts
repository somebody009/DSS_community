import * as z from "zod";

// Define a schema for questions with the following properties
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130), // Title must be a string with a minimum length of 5 and a maximum length of 130
  explanation: z.string().min(100), // Explanation must be a string with a minimum length of 100
  tags: z.array(z.string().min(1).max(15)).min(1).max(3), // Tags must be an array of strings, each with a minimum length of 1 and a maximum length of 15. The array must contain at least 1 string and at most 3 strings
});

// Define a schema for answers with the following property
export const AnswerSchema = z.object({
  answer: z.string().min(100), // Answer must be a string with a minimum length of 100
});

// Define a schema for profiles with the following properties
export const ProfileSchema = z.object({
  name: z.string().min(3).max(50), // Name must be a string with a minimum length of 3 and a maximum length of 50
  username: z.string().min(3).max(50), // Username must be a string with a minimum length of 3 and a maximum length of 50
  portfolioWebsite: z.string().url().nullable(), // Portfolio website must be a string that is a valid URL or null
  location: z.string().optional(), // Location is an optional string
  bio: z.string().min(10).max(150), // Bio must be a string with a minimum length of 10 and a maximum length of 150
});
