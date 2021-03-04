import { RouteProp } from '@react-navigation/native';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { ReactElement, ReactNode } from 'react';
import { User } from './user';

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
