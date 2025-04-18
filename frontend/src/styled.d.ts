import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      fg: string;
      border: string;
      text: string;
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
