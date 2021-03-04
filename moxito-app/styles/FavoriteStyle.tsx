import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { COLORS } from '../themes/colors';

export default (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background
    },
    text: {
      fontSize: 20,
      color: theme.colors.text,
      textAlign: 'center'
    },
  });
