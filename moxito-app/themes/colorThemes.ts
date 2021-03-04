import { COLORS } from './colors';
export type Colors = {
  primary?: string;
  text?: string;
  background?: string;
  surface?: string;
  accent?: string;
  error?: string;
  onSurface?: string;
  onBackground?: string;
  disabled?: string;
  placeholder?: string;
  backdrop?: string;
  notification?: string;
}

// Light theme colors
export const lightColors: Colors = {
  background: COLORS.white,
  text: COLORS.black,
  placeholder: COLORS.black,
  primary: COLORS.darkOrange
};

// Dark theme colors
export const darkColors = {
  background: COLORS.black,
  text: COLORS.white,
  placeholder: COLORS.white,
  primary: COLORS.orange
};
