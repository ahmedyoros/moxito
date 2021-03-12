import { DarkTheme as DarkNavigationTheme, DefaultTheme as DefaultNavigationTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native-appearance';
import { DarkTheme, DefaultTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { darkColors, lightColors } from './colorThemes';

export default function useTheme(): Theme {
  const isDark = useColorScheme() === 'dark';
  const colors = (isDark ? darkColors : lightColors);
  const paperColors = (isDark ? DarkTheme.colors : DefaultTheme.colors)
  return {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...paperColors,
      ...colors,
      surface: colors.surface,
      accent: colors.primary,
      notification: colors.primary,
      onSurface: colors.surface,
    },
  };
}

export function useNavigationTheme(): NavigationTheme {
  const isDark = useColorScheme() === 'dark';
  const colors = (isDark ? darkColors : lightColors);
  const navigationColors = (isDark ? DarkNavigationTheme.colors : DefaultNavigationTheme.colors)
  return {
    ...DefaultNavigationTheme,
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: navigationColors.border,
      notification: navigationColors.notification,
    },
  };
}
