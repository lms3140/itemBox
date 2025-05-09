import { DefaultTheme } from "styled-components";

// 다크모드 색 지정후 gpt로 라이트모드의 색 추천받음...

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

export const lightTheme: DefaultTheme = {
  colors: {
    bg: "#F9F9F9", // 밝은 배경
    fg: {
      active: "#E0E0E0", // 입력 필드/카드 배경
      disabled: "#CCCCCC", // 비활성화된 요소
    },
    hover: "#D0D7E0", // 버튼/필드 hover 배경
    primary: "#4F7DD9", // 동일한 강조 색상
    border: "#333333", // 어두운 테두리로 대비 확보
    text: "#1A1A1A", // 진한 텍스트 컬러
    error: "#FF4D4F", // 강조 빨강 유지
  },
  btn: {
    variant: {
      danger: "red",
      normal: "#E0E0E0", // 밝은 배경
      primary: "#4F7DD9", // 일관된 primary 색상
    },
    text: {
      danger: "#ffffff",
      normal: "#1A1A1A", // 진한 텍스트
      primary: "#ffffff",
    },
  },
};
