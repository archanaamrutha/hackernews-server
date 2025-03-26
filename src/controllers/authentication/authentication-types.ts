import type { User } from "@prisma/client";

export enum SignInWithUsernameAndPasswordError {
  CONFLICTING_USERNAME = "CONFLICTING_USERNAME",
  UNKNOWN = "UNKNOWN",
}

export type SignInWithUsernameAndPasswordResult = {
  token: string;
  user: User;
};

export type LogInWithUsernameAndPasswordResult = {
  token: string;
  user: User;
};

export enum LogInWtihUsernameAndPasswordError {
  INCORRECT_USERNAME_OR_PASSWORD = "INCORRECT_USERNAME_OR_PASSWORD",
  UNKNOWN = "UNKNOWN",
}
