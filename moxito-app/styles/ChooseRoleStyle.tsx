import { StyleSheet } from 'react-native';
import { COLORS } from '../themes/colors';
import { Theme } from '../themes/ThemeProvider';

export default (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  backgroundImage: {
    flex: 1,
    backgroundColor: COLORS.orange,
  }
});
