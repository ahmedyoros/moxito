import { StyleSheet } from 'react-native';
import { COLORS } from '../themes/colors';
import { Theme } from '../themes/ThemeProvider';

export default (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background
  },

  button: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    margin: 5,
    width: 250,
    height: 50,
    textAlignVertical: 'center',
    color: 'black',
    fontWeight: 'bold',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  },

  text: {
    fontSize: 20,
    marginVertical: 20,
  },

  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  }
});
