import { createRoot } from "react-dom/client";

import { getElementById } from "@utils/dom/get-element-by-id";

import App from "./app";

getElementById("app").match(
  (element) => createRoot(element).render(<App />),
  (err) => alert(err)
);
