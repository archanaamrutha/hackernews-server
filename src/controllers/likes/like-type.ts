import type { Like } from "@prisma/client";

export enum LikePostError {
  NOT_FOUND,
  ALREADY_LIKED,
  UNAUTHORIZED,
}

export type LikePostResult = {
  like: Like;
};

export type GetLikePost = {
  likes: Array<Like>;
  total: number;
};
export enum GetLikePostError {
  BAD_REQUEST,
  UNAUTHORIZED,
}
