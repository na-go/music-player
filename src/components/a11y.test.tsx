import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { render } from "@testing-library/react";
import { glob } from "glob";
import { axe } from "vitest-axe";

import type { Meta } from "@storybook/react";

type Stories = Omit<
  {
    [key: string]: React.FC;
  },
  "default"
> & {
  default: Meta;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("storybook component a11y test", async () => {
  const paths = await glob(join(__dirname, "../components/**/*.stories.tsx"));
  const stories = await Promise.all(paths.map((path) => import(path)));

  stories.forEach((story) => {
    const { default: meta, ...components } = story as Stories;

    describe(`${meta.title} a11y test`, () => {
      Object.entries(components).forEach(([name, Component]) => {
        it(`${name}`, async () => {
          const { container } = render(<Component />);
          const results = await axe(container);
          expect(results).toHaveNoViolations();
        });
      });
    });
  });
});
