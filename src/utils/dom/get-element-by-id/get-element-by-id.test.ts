import { getElementById } from ".";

test("success pattern", () => {
  const div = document.createElement("div");
  div.id = "test";
  document.body.appendChild(div);
  expect(getElementById("test")._unsafeUnwrap()).toBe(div);
  document.body.removeChild(div);
});

test("failure pattern", () => {
  const div = document.createElement("div");
  div.id = "test";
  document.body.appendChild(div);
  expect(getElementById("test2")._unsafeUnwrapErr()).toBe("Element not found");
  document.body.removeChild(div);
});
