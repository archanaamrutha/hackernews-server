import {
  LogInWtihUsernameAndPasswordError,
  SignInWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignInWithUsernameAndPasswordResult,
} from "./authentication-types.js";

import { prismaClient } from "../../extras/prisma.js";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";

export const checkIfUserAlreadyExists = async (parameters: {
  username: string;
}): Promise<boolean> => {
  const existinguser = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
    },
  });

  if (existinguser) {
    return true;
  } else {
    return false;
  }
};

export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
  // Generate token
  const jwtPayload: jwt.JwtPayload = {
    iss: "https://purpleshorts.co.in",
    sub: parameters.id,
    username: parameters.username,
  };

  const token = jwt.sign(jwtPayload, jwtSecretKey, {
    expiresIn: "30d",
  });

  return token;
};

export const SignInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<SignInWithUsernameAndPasswordResult> => {
  try {
    const existinguser = await checkIfUserAlreadyExists({
      username: parameters.username,
    });
    if (existinguser) {
      throw SignInWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const passwordHash = await createPasswordHash({
      password: parameters.password,
    });

    const user = await prismaClient.user.create({
      data: {
        username: parameters.username,
        password: passwordHash,
      },
    });

    const token = await createJWToken({
      id: user.id,
      username: user.username,
    });

    const result: SignInWithUsernameAndPasswordResult = {
      token,
      user,
    };
    return result;
  } catch (e) {
    console.log("Error: ", e);
    throw SignInWithUsernameAndPasswordError.UNKNOWN;
  }
};

export const logInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  // 1. Create the password hash
  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  // 2. Find the user with the username and password hash
  const user = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  // 3. If the user is not found, throw an error
  if (!user) {
    throw LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  // 4. If the user is found, create a JWT token and return it
  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};
