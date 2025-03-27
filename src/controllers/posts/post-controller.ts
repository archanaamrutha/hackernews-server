import { prismaClient } from "../../extras/prisma.js";
import {
  type CreatePostInput,
  type CreatePostResult,
  CreatePostError,
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
