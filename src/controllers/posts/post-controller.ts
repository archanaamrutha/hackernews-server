import { prismaClient } from "../../extras/prisma.js";
import { GetMeError } from "../users/user-types.js";
import {
  type CreatePostInput,
  type CreatePostResult,
  type GetPostResults,
  CreatePostError,
  GetPostError,
} from "./post-types.js";

export const createPost = async (parameters: {
  userId: string;
  input: CreatePostInput;
}): Promise<CreatePostResult> => {
  const { userId, input } = parameters;

  if (!input.title || !input.content) throw CreatePostError.BAD_REQUEST;

  const post = await prismaClient.post.create({
    data: {
      title: input.title,
      content: input.content,
      userId,
    },
  });

  return {
    post,
  };
};

export const getAllPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<GetPostResults> => {
  const posts = await prismaClient.post.findMany({
    orderBy: {
      createdAt: "asc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  if (!posts) {
    throw GetPostError.BAD_REQUEST;
  }
  const totalPosts = await prismaClient.post.count();

  return {
    posts,
    total: totalPosts,
  };
};
