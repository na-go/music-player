import { err, ok, type Result } from "neverthrow";

export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);

  return element !== null ? ok(element) : err("Element not found");
};
