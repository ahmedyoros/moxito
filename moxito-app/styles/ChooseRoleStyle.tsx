import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/types';

export default (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  backgroundImage: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  }
});
