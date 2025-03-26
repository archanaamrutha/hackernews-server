import { allroutes } from "./routes/routes.js";
import { serve } from "@hono/node-server";

serve(allroutes, (info) => {
  console.log(`Server is running on port ${info.port}`);
});
