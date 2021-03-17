import React from 'react';
import { View } from 'react-native';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { sendMessage, useChat } from '../backend/ChatManager';
import Loading from '../components/Loading';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { Race } from '../types/Race';
import { User } from '../types/User';

export default function Chat({ navigation, route }: NavigationProps) {
  const race: Race = route.params!.race;
  const user: User = route.params!.user;
  const theme = useTheme();
  
  const [messages, loading] = useChat(user.currentRaceId!);
  if (loading) return <Loading />;

  const onSend = (messages: IMessage[]) => {
    for (const message of messages) {
      message.createdAt = Date.now();
      sendMessage(user.currentRaceId!, message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.id,
          name: user.displayName,
          avatar: user.photoURL,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: theme.colors.surface,
              },
              right: {
                backgroundColor: theme.colors.primary,
              },
            }}
          />
        )}
      />
    </View>
  );
}
