import type { User } from "@prisma/client";
import { prismaClient } from "../../extras/prisma.js";
import {
  GetMeError,
  
  type GetMeResult,
  
} from "./user-types.js";

export const getMe = async (parameters: {
  userId: string;
}): Promise<GetMeResult> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw GetMeError.BAD_REQUEST;
  }

  return {
    user,
  };
};

// export const getAllUsers = async (): Promise<usersResult> => {
//   const users = await prismaClient.user.findMany();
//   if (!users) {
//     throw usersError.BAD_REQUEST;
//   }
//   return {
//     users,
//   };
// };
