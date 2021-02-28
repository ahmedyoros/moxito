import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { COLORS } from '../themes/colors';

export default (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor:theme.colors.background,
    flex: 1,
    alignItems: 'center',
  },
  
  button: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    margin: 15,
    width: 250,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
    alignSelf: 'center'
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
