import { COLORS } from './colors';
export type Colors = typeof lightColors;

// Light theme colors
export const lightColors = {
  background: COLORS.white,
  primary: '#512DA8',
  text: '#121212',
  error: '#D32F2F',
};

// Dark theme colors
export const darkColors = {
  background: COLORS.grey,
  primary: '#B39DDB',
  text: '#FFFFFF',
  error: '#EF9A9A',
};
