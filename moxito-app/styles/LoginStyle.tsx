import { StyleSheet } from 'react-native';
import { Theme } from '../themes/ThemeProvider';
import { COLORS } from '../themes/colors';

export default (theme: Theme) => StyleSheet.create({
  providerIcons: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  providerButton: {
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
  },
});
