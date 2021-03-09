import { RouteProp } from '@react-navigation/native';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { ReactElement, ReactNode } from 'react';
import { Race } from './Race';
import { User } from './User';

export type NodeProps = {
  children: ReactNode[] | ReactNode;
};

export type ElementProps = {
  children: ReactElement[] | ReactElement;
};

export type NavigationProps = {
  navigation: StackNavigationHelpers;
  route: RouteProp<any, any>;
};

export type UserProps = {
  user: User;
}

export type RaceProps = {
  race: Race;
}
