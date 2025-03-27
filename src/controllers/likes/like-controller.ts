import { prismaClient } from "../../extras/prisma.js";
import {
  type LikePostResult,
  LikePostError,
  type GetLikePost,
  GetLikePostError,
  DeleteLikeError,
} from "./like-type.js";

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

export const getLikePosts = async (parameters: {
  userId: string;
  postId: string;
  page: number;
  limit: number;
}): Promise<GetLikePost> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw GetLikePostError.UNAUTHORIZED;
  }
  const likes = await prismaClient.like.findMany({
    where: {
      postId: parameters.postId,
    },
    orderBy: {
      createdAt: "asc",
    },
    skip: (parameters.page - 1) * parameters.limit,
    take: parameters.limit,
  });

  if (!likes) {
    throw GetLikePostError.BAD_REQUEST;
  }
  const totallikes = await prismaClient.like.count();

  return {
    likes,
    total: totallikes,
  };
};

export const deleteLikes = async (parameters: {
  userId: string;
  postId: string;
}) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw DeleteLikeError.UNAUTHORIZED;
  }
  const post = await prismaClient.post.findUnique({
    where: {
      id: parameters.postId,
    },
  });

  if (!post) {
    return DeleteLikeError.NOT_FOUND;
  }

  const existinglike = await prismaClient.like.findFirst({
    where: {
      userId: parameters.userId,
      postId: parameters.postId,
    },
  });

  if (!existinglike) {
    throw DeleteLikeError.LIKE_NOT_FOUND;
  }

  await prismaClient.like.delete({
    where: {
      id: existinglike.id,
    },
  });
  return {
    message: "Like on the given post deleted suceesfully",
  };
};
