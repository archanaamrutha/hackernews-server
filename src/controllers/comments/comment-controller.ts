import { prismaClient } from "../../extras/prisma.js";
import {
  type CommentPostResult,
  CommentPostError,
  type GetCommentPost,
  GetCommentPostError,
  DeleteCommentError,
  type UpdateCommet,
  UpdateCommetError,
} from "./comment-types.js";

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

export const getCommentPosts = async (parameters: {
  userId: string;
  postId: string;
  page: number;
  limit: number;
}): Promise<GetCommentPost> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw GetCommentPostError.UNAUTHORIZED;
  }
  const comments = await prismaClient.comment.findMany({
    where: {
      postId: parameters.postId,
    },
    orderBy: {
      createdAt: "asc",
    },
    skip: (parameters.page - 1) * parameters.limit,
    take: parameters.limit,
  });

  if (!comments) {
    throw GetCommentPostError.BAD_REQUEST;
  }
  const totalcomments = await prismaClient.comment.count();

  return {
    comments,
    total: totalcomments,
  };
};

export const deleteComment = async (parameters: {
  userId: string;
  commentId: string;
}) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw DeleteCommentError.UNAUTHORIZED;
  }

  const comment = await prismaClient.comment.findUnique({
    where: {
      id: parameters.commentId,
    },
  });

  if (!comment) {
    throw DeleteCommentError.NOT_FOUND;
  }

  await prismaClient.comment.delete({
    where: {
      id: parameters.commentId,
    },
  });

  return {
    message: "Comment deleted successfully!!!",
  };
};

export const updateCommentById = async (parameters: {
  userId: string;
  commentId: string;
  content: string;
}): Promise<UpdateCommet> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw UpdateCommetError.UNAUTHORIZED;
  }

  const comment = await prismaClient.comment.findUnique({
    where: {
      id: parameters.commentId,
    },
  });

  if (!comment) {
    throw UpdateCommetError.NOT_FOUND;
  }

  const result = await prismaClient.comment.update({
    where: {
      id: parameters.commentId,
    },
    data: {
      content: parameters.content,
    },
  });
  return {
    comment: result,
  };
};
