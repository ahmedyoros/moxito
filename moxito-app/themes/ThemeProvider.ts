import { useColorScheme } from 'react-native-appearance';
import { DefaultTheme, Surface } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { COLORS } from './colors';
import { darkColors, lightColors } from './colorThemes';

export default function useTheme(): Theme {
  const isDark = useColorScheme() === 'dark';

  return {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      ...(isDark ? darkColors : lightColors),
      primary: COLORS.orange,
      // placeholder: COLORS.orange,
      // accent: COLORS.orange,
      surface: COLORS.orange,
    },
  };
}
