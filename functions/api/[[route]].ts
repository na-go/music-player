import { handle } from "hono/cloudflare-pages";

import app from "../server";

export const onRequest = handle(app);
