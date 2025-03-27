import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import {
  createPost,
  getAllPosts,
} from "../controllers/posts/post-controller.js";
import {
  CreatePostError,
  GetPostError,
} from "../controllers/posts/post-types.js";

export const postRoutes = new Hono();

postRoutes.post("/create-post", tokenMiddleware, async (context) => {
  const userId = await context.get("userId");
  const input = await context.req.json();

  try {
    const result = await createPost({
      userId,
      input,
    });
    return context.json(
      {
        data: result,
      },
      200
    );
  } catch (e) {
    if (e === CreatePostError.BAD_REQUEST) {
      return context.json(
        {
          message: "Title and content are required",
        },
        400
      );
    }

    if (e === CreatePostError.UNAUTHORIZED) {
      return context.json(
        {
          message: "User is not authorized",
        },
        401
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

postRoutes.get("/getAllposts", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page") || 1);
  const limit = Number(context.req.query("limit") || 10);
  try {
    const result = await getAllPosts(page, limit);

    return context.json(
      {
        data: result.posts,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      },
      200
    );
  } catch (e) {
    return context.json({ message: e }, 404);
  }
});
