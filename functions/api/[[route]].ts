import { handle } from "hono/cloudflare-pages";

import app from "..";

export const onRequest = handle(app);
