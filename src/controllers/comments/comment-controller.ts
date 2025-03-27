import { prismaClient } from "../../extras/prisma.js";
import { type CommentPostResult, CommentPostError } from "./comment-types.js";

export const commentPost = async (parameters: {
  userId: string;
  postId: string;
  content: string;
}): Promise<CommentPostResult> => {
  const { userId, postId, content } = parameters;

  const existuser = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existuser) throw CommentPostError.UNAUTHORIZED;

  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) throw CommentPostError.NOT_FOUND;

  const result = await prismaClient.comment.create({
    data: {
      content,
      userId,
      postId,
    },
  });

  return {
    comment: result,
  };
};
