import { Hono } from "hono";
import { prismaClient } from "../extras/prisma.js";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { getMe } from "../controllers/users/user-controller.js";
import { GetMeError } from "../controllers/users/user-types.js";

export const usersRoutes = new Hono();

usersRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");

  try {
    const user = await getMe({
      userId,
    });

    return context.json(
      {
        data: user,
      },
      200
    );
  } catch (e) {
    if (e === GetMeError.BAD_REQUEST) {
      return context.json(
        {
          error: "User not found",
        },
        400
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// usersRoutes.get("/users", tokenMiddleware, async (context) => {
//   try {
//     const users = await getAllUsers();
//     return context.json(users, 200);
//   } catch (e) {
//     return context.json({ message: e }, 404);
//   }
// });
