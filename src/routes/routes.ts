import { Hono } from "hono";
import { authenticationroutes } from "./authentication-routes.js";
import { usersRoutes } from "./user-routes.js";
export const allroutes = new Hono();

allroutes.get("/health", async (context) => {
  return context.json(
    {
      message: "AllOk",
    },
    200
  );
});

allroutes.route("/auth", authenticationroutes);
allroutes.route("/users", usersRoutes);
