import {
  CURRENCY_API_KEY,
} from '@env';

import fx from 'money';
fx.rates = {
  'USD': 1,
  'EUR': 0.84,
  'GNF': 10055.00
}
fx.base = 'USD';
fx.settings = { from: "USD", to: "EUR"};

export default fx;