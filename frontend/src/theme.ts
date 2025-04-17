import { DefaultTheme } from "styled-components/dist/types";

export const darkTheme: DefaultTheme = {
  colors: {
    bg: "#181D1F",
    fg: "#3F4454",
    border: "#ffffff",
    text: "#F9F5F8",
  },
  btn: {
    variant: {
      danger: "red",
      normal: "#3F4454",
      primary: "blue",
    },
    text: {
      danger: "#ffffff",
      normal: "#F9F5F8",
      primary: "#F9F5F8",
    },
  },
};

export const lightTheme = {};
