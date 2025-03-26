import { Hono } from "hono";
import {
  logInWithUsernameAndPassword,
  SignInWithUsernameAndPassword,
} from "../controllers/authentication/authentication-controller.js";
import {
  LogInWtihUsernameAndPasswordError,
  SignInWithUsernameAndPasswordError,
} from "../controllers/authentication/authentication-types.js";
export const authenticationroutes = new Hono();

authenticationroutes.post("/sign-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    const user = await SignInWithUsernameAndPassword({
      username,
      password,
    });
    return context.json(
      {
        data: user,
      },
      200
    );
  } catch (e) {
    if (e === SignInWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "User already exists",
        },
        404
      );
    }
    if (e === SignInWithUsernameAndPasswordError.UNKNOWN) {
      return context.json(
        {
          message: "Unkown",
        },
        500
      );
    }
  }
});

authenticationroutes.post("/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });
    return context.json({
      data: result,
    });
  } catch (e) {
    if (
      e === LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD
    ) {
      return context.json(
        {
          message: "Incorrect username or password",
        },
        401
      );
    }
    return context.json(
      {
        mesage: "Unkown",
      },
      500
    );
  }
});
