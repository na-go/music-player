import { Toggle } from "@radix-ui/react-toggle";
import { memo, useMemo } from "react";

import type { FC } from "react";

export type ToggleThemeProps = {
  onClick?: () => void;
  value: "light" | "dark";
};

const ToggleTheme: FC<ToggleThemeProps> = ({ value, onClick }) => {
  const rendered = useMemo(() => {
    switch (value) {
      case "light":
        return "light";
      case "dark":
        return "dark";
    }
  }, [value]);

  return (
    <Toggle aria-label="Toggle website theme" onClick={onClick} value={value}>
      {rendered}
    </Toggle>
  );
};

export default memo(ToggleTheme);
