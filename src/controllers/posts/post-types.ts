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

export type GetPostResults = {
  posts: Array<Post>;
  total: number;
};
export enum GetPostError {
  BAD_REQUEST,
}
