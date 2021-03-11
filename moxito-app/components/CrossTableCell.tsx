import React from 'react';
import { Text } from 'react-native';
import { COLORS } from '../themes/colors';

type CellProps = {
  title: string;
  subtitle: string;
};

export default function CrossTableCell({ title, subtitle }: CellProps) {
  const color = COLORS.grey;
  return (
    <>
      <Text
        style={{
          fontSize: 30,
          marginBottom: -6,
          color: color,
        }}
      >
        {title}
      </Text>
      <Text
        style={{ fontSize: 20, color: color }}
      >
        {subtitle}
      </Text>
    </>
  );
}
