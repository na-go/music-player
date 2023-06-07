import "@acab/reset.css";
import type { FC, ReactNode } from "react";

type ThemeProviderProps = {
  children?: ReactNode;
};
const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export { ThemeProvider };
