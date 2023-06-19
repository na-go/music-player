import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import { getTrack, getTracks, postTrack } from "./modules/tracks";

import type { Env } from "../../types/type";

const app = new Hono<Env>();
app.basePath("/api");

app.use("/api/*", cors());

app.use("/api/*", async (c, next) => {
  c.set("db", drizzle(c.env.DB));
  await next();
});

const route = app
  .get(
    "/api/tracks",
    getTracks
  )
  .get(
    "/api/track/:id",
    getTrack
  )
  .post(
    "/api/track",
    zValidator(
      "form",
      z.object({
      name: z.string(),
      url: z.string(),
    })
    ),
    postTrack);

export type AppType = typeof route;

export default app;
