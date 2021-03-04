import { COLORS } from './colors';
export type Colors = {
  primary: string;
  text: string;
  background: string;
  surface: string;
}

// Light theme colors
export const lightColors: Colors = {
  background: COLORS.white,
  text: COLORS.black,
  primary: COLORS.darkOrange,
  surface: COLORS.white,
};

// Dark theme colors
export const darkColors: Colors = {
  background: COLORS.black,
  text: COLORS.white,
  primary: COLORS.orange,
  surface: COLORS.grey
};
