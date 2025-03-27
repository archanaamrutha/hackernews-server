import { prismaClient } from "../../extras/prisma.js";
import { type LikePostResult, LikePostError } from "./like-type.js";

export const likePost = async (parameters: {
  userId: string;
  postId: string;
}): Promise<LikePostResult> => {
  const { userId, postId } = parameters;

  const existuser = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existuser) throw LikePostError.UNAUTHORIZED;

  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) throw LikePostError.NOT_FOUND;

  const alreadyliked = await prismaClient.like.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (alreadyliked) throw LikePostError.ALREADY_LIKED;

  const result = await prismaClient.like.create({
    data: {
      userId,
      postId,
    },
  });

  return {
    like: result,
  };
};
