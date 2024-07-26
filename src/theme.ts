"use client";

import { colorsTuple, createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  /** Put your mantine theme override here */
  black: "#000000",
  white: "#FFFFFF",
  fontSizes: {
    xs: rem(14),
    sm: rem(16),
    md: rem(18),
    lg: rem(20),
    xl: rem(24),
    xxl: rem(32),
    xxxl: rem(40),
  },
  lineHeights: {
    xs: "125%",
    sm: "125%",
    md: "125%",
    lg: "125%",
    xl: "125%",
    xxl: "125%",
    xxxl: "125%",
  },
});
