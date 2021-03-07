import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Helmet from './assets/icons/helmet.svg';
import House from './assets/icons/house.svg';
import Logo from './assets/logos/logo-client.svg';
import Avatar from './components/Avatar';
import { Role } from './enums/Role';
import './logs/IgnoreLogs';
import Adresses from './screens/Adresses';
import ChooseRole from './screens/ChooseRole';
import Drivers from './screens/Drivers';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import CommonStyle from './styles/CommonStyle';
import useTheme, { useNavigationTheme } from './themes/ThemeProvider';
import { NavigationProps } from './types/Props';
import { defaultPictureUrl } from './types/user';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const [logged, setLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);

  firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
    if (user) {
      setLogged(true);
      setNewUser(user.metadata.creationTime == user.metadata.lastSignInTime);
    } else {
      setLogged(false);
    }
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={useNavigationTheme()}>
        {logged ? renderMenu() : renderLogin()}
      </NavigationContainer>
    </PaperProvider>
  );

  function renderLogin(): React.ReactNode {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRole}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ route }: NavigationProps) => ({
            title: route.params!.register
              ? `S'inscrire comme ${Role.toString(route.params!.role)}`
              : 'Se connecter',
          })}
        />
      </Stack.Navigator>
    );
  }

  function renderMenu(): React.ReactNode {
    const routeNames = [
      'Accueil',
      'Votre profile',
      'Mes adresses préférées',
      'Mes chauffeurs préférés',
    ];
    return (
      <Drawer.Navigator
        drawerContent={renderDrawerItems}
        initialRouteName={routeNames[newUser ? 1 : 0]}
        screenOptions={{
          headerShown: true,
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeftAccessibilityLabel: 'coucou',
        }}
      >
        <Drawer.Screen
          name={routeNames[0]}
          component={Home}
          options={{
            drawerIcon: () => (
              <Ionicons name="map" size={20} color={theme.colors.primary} />
            ),
          }}
        />
        <Drawer.Screen
          name={routeNames[1]}
          component={Profile}
          initialParams={{ newUser: newUser }}
          options={{
            drawerIcon: () => (
              <Logo width={20} height={20} fill={theme.colors.primary} />
            ),
          }}
        />
        <Drawer.Screen
          name={routeNames[2]}
          component={Adresses}
          options={{
            drawerIcon: () => <House width={20} height={20} />,
          }}
        />
        <Drawer.Screen
          name={routeNames[3]}
          component={Drivers}
          options={{
            drawerIcon: () => <Helmet width={20} height={20} />,
          }}
        />
      </Drawer.Navigator>
    );
  }

  function renderDrawerItems(props: any) {
    const fireUser = firebase.auth().currentUser!;
    return (
      <DrawerContentScrollView {...props}>
        <SafeAreaView
          style={[
            commonStyle.container,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Avatar size={50} imageUrl={fireUser.photoURL || defaultPictureUrl} />
          <Text style={[commonStyle.text]}>{fireUser.displayName}</Text>
        </SafeAreaView>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Se déconnecter"
          onPress={() => firebase.auth().signOut()}
        />
      </DrawerContentScrollView>
    );
  }
}
