import type { Comment } from "@prisma/client";

export enum CommentPostError {
  NOT_FOUND,
  UNAUTHORIZED,
}

export type CommentPostResult = {
  comment: Comment;
};
