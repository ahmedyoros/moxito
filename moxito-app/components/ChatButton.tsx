import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { MyNavigationProp, UserRaceProps } from '../types/Props';
import { useNavigation } from '@react-navigation/native';
import { Subheading } from 'react-native-paper';
import Loading from './Loading';
import { useUnreadMessagesCount } from '../backend/ChatManager';
import { COLORS } from '../themes/colors';
import { Role } from '../enums/Role';

export default function ChatButton({ user, race }: UserRaceProps) {
  const navigation: MyNavigationProp = useNavigation();
  const [unreadMessagesCount, loading] = useUnreadMessagesCount(
    user.currentRaceId!,
    race![Role.opposite(user.role)]!.id
  );

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={{ flexDirection: 'column', marginRight: 15, marginTop: 15 }}>
      {renderUnreadMessageBadge()}
      <FontAwesome5
        style={[commonStyle.roundIcon, commonStyle.shadow]}
        name="rocketchat"
        size={24}
        color={theme.colors.primary}
        onPress={() => navigation.navigate('Chat', { race: race, user: user })}
      />
      <Subheading style={{ color: theme.colors.primary, textAlign: 'center' }}>
        Chat
      </Subheading>
    </View>
  );

  function renderUnreadMessageBadge() {
    if (loading)
      return (
        <Loading
          size={20}
          style={commonStyle.notifyBadge}
          color={COLORS.darkOrange}
        />
      );
    if (unreadMessagesCount > 0)
      return (
        <View
          style={[
            commonStyle.notifyBadge,
            {
              borderRadius: 40,
              width: 20,
              height: 20,
              backgroundColor: COLORS.darkOrange,
            },
          ]}
        >
          <Text style={[commonStyle.text, { color:COLORS.white, bottom: 5, left: 5 }]}>
            {unreadMessagesCount}
          </Text>
        </View>
      );
  }
}
