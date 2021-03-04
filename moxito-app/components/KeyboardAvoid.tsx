import { HeaderHeightContext } from '@react-navigation/stack';
import { default as React, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NodeProps } from '../types/Props';

export default function KeyboardAvoid({ children }: NodeProps) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <HeaderHeightContext.Consumer>
      {(headerHeight) => (
        <KeyboardAvoidingView
          style={commonStyle.container}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
          keyboardVerticalOffset={headerHeight! + 64}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
              {Array.isArray(children)
                ? children.map((child: ReactNode) => child)
                : children}
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </HeaderHeightContext.Consumer>
  );
}
