import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { COLORS } from '../themes/colors';

export default (theme: Theme) => StyleSheet.create({
  providerIcons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
