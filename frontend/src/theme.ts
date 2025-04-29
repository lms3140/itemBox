import { DefaultTheme } from "styled-components/dist/types";

export const darkTheme: DefaultTheme = {
  colors: {
    bg: "#181D1F",
    fg: {
      active: "#3F4454",
      disabled: "#7A7F8F",
    },
    hover: "#596073",
    primary: "#4F7DD9",
    border: "#ffffff",
    text: "#F9F5F8",
    error: "#FF4D4F",
  },
  btn: {
    variant: {
      danger: "red",
      normal: "#3F4454",
      primary: "#4F7DD9",
    },
    text: {
      danger: "#ffffff",
      normal: "#F9F5F8",
      primary: "#F9F5F8",
    },
  },
};

const lightTheme = {};
