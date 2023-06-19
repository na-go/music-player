import { hc } from "hono/client";

import type { AppType } from "functions/server";

export const client = hc<AppType>('/api')
