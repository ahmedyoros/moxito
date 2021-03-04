import React, { ReactElement, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { ElementProps, NodeProps } from '../types/Props';
import { User } from '../types/user';
import Loading from './Loading';
import useUser from './UserProvider';

export default function UserLoading({ children }: ElementProps) {
  const user: User = useUser();
  if (!user) return <Loading />;
  const childrenWithAdjustedProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { user })
  );

  return <>{childrenWithAdjustedProps}</>;
}
