import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      fg: {
        active: string;
        disabled: string;
      };
      hover: string;
      primary: string;
      border: string;
      text: string;
      error: string;
    };
    btn: {
      variant: {
        primary: string;
        danger: string;
        normal: string;
      };
      text: {
        primary: string;
        danger: string;
        normal: string;
      };
    };
  }
}
