import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const FACEBOOK_ID = Constants.manifest['facebookAppId'];

const isNative = Constants.appOwnership !== 'expo' && Platform.OS !== 'web';
const useProxy =
  (Constants.appOwnership === 'expo' && Platform.OS !== 'web') ||
  Platform.OS === 'android';

export const facebookConfig = {
  clientId: FACEBOOK_ID,
  scopes: ['public_profile', 'email'],
  
  // For usage in managed apps using the proxy
  redirectUri: isNative
    ? Platform.OS === 'android'
      ? `https://auth.expo.io/@moxito/${Constants.manifest.slug}`
      : `fb${FACEBOOK_ID}://authorize`
    : makeRedirectUri({
        useProxy,
        // For usage in bare and standalone
        // Use your FBID here. The path MUST be `authorize`.
        native: `fb${FACEBOOK_ID}://authorize`,
      }),

  useProxy,
  extraParams: {
    // Use `popup` on web for a better experience
    display: Platform.select({ web: 'popup' }) as string,
    // Optionally you can use this to rerequest declined permissions
    // auth_type: 'rerequest',
  },
}