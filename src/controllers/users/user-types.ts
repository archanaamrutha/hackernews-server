import type { User } from "@prisma/client";

export type GetMeResult = {
  user: User;
};

export enum GetMeError {
  BAD_REQUEST,
}

// export type usersResult = {
//   users: Array<User>;
// };
// export enum usersError {
//   BAD_REQUEST,
// }
