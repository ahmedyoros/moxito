import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, StatusBar} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Helmet from './assets/icons/helmet.svg';
import House from './assets/icons/house.svg';
import { getFireUser } from './backend/UserManager';
import Avatar from './components/Avatar';
import { auth } from './config';
import { Role } from './enums/Role';
import './logs/IgnoreLogs';
import Adresses from './screens/Adresses';
import ChooseRole from './screens/ChooseRole';
import Drivers from './screens/Drivers';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import PublicProfile from './screens/PublicProfile';
import CommonStyle from './styles/CommonStyle';
import { COLORS } from './themes/colors';
import useTheme, { useNavigationTheme } from './themes/ThemeProvider';
import { NavigationProps } from './types/Props';
import { defaultPictureUrl } from './types/User';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const [logged, setLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);



  auth.onAuthStateChanged((user) => {
    if (user) {
      setLogged(true);
      setNewUser(user.metadata.creationTime == user.metadata.lastSignInTime);
    } else {
      setLogged(false);
    }
  });

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}  />
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
      'Ma course',
      'Modifier mon profile',
      'Mon profile public',
      'Mes adresses préférées',
      'Mes chauffeurs préférés',
    ];
    const initialRouteName = routeNames[newUser ? 1 : 0];
    
    return (
      <Drawer.Navigator
        drawerContent={renderDrawerItems}
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: true,
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen
          name={routeNames[0]}
          component={Home}
          options={{
            headerShown: false,
            drawerIcon: () => (
              <Ionicons name="map" size={20} color={COLORS.orange} />
            )
          }}
        />
        <Drawer.Screen
          name={routeNames[1]}
          component={Profile}
          initialParams={{ newUser: newUser }}
          options={{
            drawerIcon: () => (
              <Image
                style={{ width: 20, height: 22.1052631579 }}
                source={require('./assets/logos/logo-client.png')}
              />
            ),
          }}
          
        />
        <Drawer.Screen
          name={routeNames[2]}
          component={PublicProfile}
          options={{
            drawerIcon: () => <Ionicons name="star" size={20} color={COLORS.orange} />
          }}
        />
        <Drawer.Screen
          name={routeNames[3]}
          component={Adresses}
          options={{
            drawerIcon: () => <House width={20} height={20} />,
          }}
        />
        <Drawer.Screen
          name={routeNames[4]}
          component={Drivers}
          options={{
            drawerIcon: () => <Helmet width={20} height={20} />,
          }}
        />
      </Drawer.Navigator>
    );
  }

  function renderDrawerItems(props: any) {
    const fireUser = getFireUser();
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
          onPress={() => auth.signOut()}
        />
      </DrawerContentScrollView>
    );
  }
}
