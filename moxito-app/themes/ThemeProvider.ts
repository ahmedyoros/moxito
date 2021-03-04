import { DefaultTheme as DefaultNavigationTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native-appearance';
import { DefaultTheme } from 'react-native-paper';
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
      // placeholder: COLORS.orange,
      // accent: COLORS.orange,
      surface: COLORS.orange,
    },
  };
}

export function useNavigationTheme(): NavigationTheme {
  const isDark = useColorScheme() === 'dark';
  const colors = (isDark ? darkColors : lightColors);
  return {
    ...DefaultNavigationTheme,
    dark: isDark,
    colors: {
      ...DefaultNavigationTheme.colors,
      ...colors,
      card: colors.background!
    },
  };
}
