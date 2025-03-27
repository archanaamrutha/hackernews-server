import type { Like } from "@prisma/client";

export enum LikePostError{
    NOT_FOUND,
    ALREADY_LIKED,
    UNAUTHORIZED
}

export type LikePostResult={
    like:Like
}