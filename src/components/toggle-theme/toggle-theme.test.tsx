import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Component from ".";

test("value test", () => {
  const { rerender } = render(<Component value="light" onClick={vi.fn()} />);
  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("light");

  rerender(<Component value="dark" onClick={vi.fn()} />);
  expect(button).toHaveTextContent("dark");
});

test("onClick test", async () => {
  const onClick = vi.fn();
  render(<Component value="light" onClick={onClick} />);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("light");

  await act(() => userEvent.click(button));
  expect(onClick).toBeCalledTimes(1);
});
