import { z } from "zod";

import type { ClientResponse } from "hono/dist/types/client/types";

export const tracksResponseSchema = (users: ClientResponse<unknown>) => {
  return z.array(z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    duration: z.number(),
  }))
}

export const trackResponseSchema = (user: ClientResponse<unknown>) => {
  return z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    duration: z.number(),
  })
}
