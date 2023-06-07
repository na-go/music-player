import { createVar, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const headerSize = createVar();
const footerSize = createVar();

export const root = style({
  vars: {
    [headerSize]: "64px",
    [footerSize]: "128px",
  },
});

export const header = style({
  height: headerSize,
  display: "flex",
  alignItems: "center",
});

export const main = style({
  minHeight: calc.subtract("100vh", headerSize, footerSize),
  "@supports": {
    "(min-height: 100dvh)": {
      minHeight: calc.subtract("100dvh", headerSize, footerSize),
    },
  },
});

export const footer = style({
  height: footerSize,
  display: "flex",
  alignItems: "center",
});
