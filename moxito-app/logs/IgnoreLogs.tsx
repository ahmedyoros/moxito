import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreLogs(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message: string | string[]) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
