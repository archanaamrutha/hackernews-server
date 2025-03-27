import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { commentPost } from "../controllers/comments/comment-controller.js";
import { CommentPostError } from "../controllers/comments/comment-types.js";

export const commentRoutes = new Hono();

commentRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = await context.req.param("postId");
  const { content } = await context.req.json();

  try {
    const result = await commentPost({
      userId,
      postId,
      content,
    });
    return context.json(result, 200);
  } catch (e) {
    if (e === CommentPostError.UNAUTHORIZED) {
      return context.json(
        {
          message: "User with the token is not found",
        },
        400
      );
    }
    if (e === CommentPostError.NOT_FOUND) {
      return context.json(
        {
          message: "Post with given id is not found",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
});
