import { eq } from "drizzle-orm";

import { tracks } from "../db/schema/tracks";

import type { Env } from "../../../types/type";
import type { Context, TypedResponse } from "hono";

export const getTracks = async (c: Context<Env>): Promise<TypedResponse> => {
  const db = c.get("db");
  const result = await db.select().from(tracks).all();

  return c.jsonT(result, 200);
};

export const getTrack = async (c: Context<Env>): Promise<Response | TypedResponse> => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"), 10);
  if (Number.isNaN(id)) return c.text("Invalid ID", 500);
  const result = await db.select().from(tracks).where(eq(tracks.id, id)).all();

  return c.jsonT(result, 200);
};

export const postTrack = async (c: Context<Env>): Promise<Response> => {
  const db = c.get("db");
  const newMusic = await c.req.json();
  await db.insert(tracks).values(newMusic.data).run();

  return c.text(`Created Track: ${newMusic.data.name}.`, 200);
};
