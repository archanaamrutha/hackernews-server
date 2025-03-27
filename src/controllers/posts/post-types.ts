import type { Post } from "@prisma/client";

export type CreatePostInput = {
  title: string;
  content: string;
};
export type CreatePostResult = {
  post: Post;
};

export enum CreatePostError {
  BAD_REQUEST,
  UNAUTHORIZED,
}
