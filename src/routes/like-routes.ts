import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import {
  likePost,
  getLikePosts,
  deleteLikes,
} from "../controllers/likes/like-controller.js";
import {
  LikePostError,
  GetLikePostError,
  DeleteLikeError,
} from "../controllers/likes/like-type.js";

export const likeRoutes = new Hono();

likeRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = await context.req.param("postId");

  try {
    const result = await likePost({
      userId,
      postId,
    });
    return context.json(result, 200);
  } catch (e) {
    if (e === LikePostError.UNAUTHORIZED) {
      return context.json(
        {
          message: "User with the token is not found",
        },
        400
      );
    }
    if (e === LikePostError.NOT_FOUND) {
      return context.json(
        {
          message: "Post with given id is not found",
        },
        404
      );
    }
    if (e === LikePostError.ALREADY_LIKED) {
      return context.json(
        {
          message: "The post is already liked",
        },
        400
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

likeRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const page = Number(context.req.query("page") || 1);
  const limit = Number(context.req.query("limit") || 10);
  const postId = await context.req.param("postId");

  try {
    const result = await getLikePosts({
      userId,
      postId,
      page,
      limit,
    });

    return context.json(
      {
        data: result.likes,
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
    if (e === GetLikePostError.UNAUTHORIZED) {
      return context.json(
        {
          message: "User with the given token is not present",
        },
        400
      );
    }
    if (e === GetLikePostError.BAD_REQUEST) {
      return context.json(
        {
          error: "There is no likes for this post",
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

likeRoutes.delete("/deletelike/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = String(await context.req.param("postId"));

  try {
    const response = await deleteLikes({
      userId,
      postId,
    });

    return context.json(response, 200);
  } catch (e) {
    if (e === DeleteLikeError.NOT_FOUND) {
      return context.json(
        {
          message: "Post is not found",
        },
        400
      );
    }
    if (e === DeleteLikeError.UNAUTHORIZED) {
      return context.json(
        {
          message: "User is not found",
        },
        400
      );
    }

    if (e === DeleteLikeError.LIKE_NOT_FOUND) {
      return context.json(
        {
          message: "Like on the post is not found",
        },
        400
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
