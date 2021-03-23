import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import 'dayjs/locale/fr';
import { Bubble, GiftedChat, IMessage, Reply, Send } from 'react-native-gifted-chat';
import { generateId, sendMessage, useChat } from '../backend/ChatManager';
import { updateRacePrice } from '../backend/RaceManager';
import Loading from '../components/Loading';
import NegociateModal from '../components/NegociateModal';
import { Role } from '../enums/Role';
import CommonStyle from '../styles/CommonStyle';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { Race } from '../types/Race';
import { User } from '../types/User';
import SendIcon from '../assets/icons/send.svg';

export default function Chat({ navigation, route }: NavigationProps) {
  const race: Race = route.params!.race;
  const user: User = route.params!.user;
  const chatUser = {
    _id: user.id,
    name: user.displayName,
    avatar: user.photoURL,
  };

  navigation.setOptions({title:'Chat avec '+race[Role.opposite(user.role)]?.displayName})

  const [messages, loading] = useChat(user.currentRaceId!);

  const [negociateModalVisible, setNegociateModalVisible] = useState(false);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  if (loading) return <Loading />;

  const onSend = (messages: IMessage[]) => {
    for (const message of messages) {
      message.createdAt = Date.now();
      sendMessage(user.currentRaceId!, message);
    }
  };

  const negociatePrice = (newPrice: number) => {
    sendMessage(user.currentRaceId!, {
      _id: generateId(user.currentRaceId!),
      createdAt: Date.now(),
      text: `Je souhaite négocier le prix de la course à ${newPrice} ${
        user.currency || 'GNF'
      }`,
      quickReplies: {
        type: 'radio', // or 'checkbox',
        values: [
          {
            title: '✔️',
            value: newPrice + '',
          },
          {
            title: `❌ rester à ${race.price} ${user.currency || 'GNF'}`,
            value: race.price + '',
          },
        ],
      },
      user: chatUser,
    });
  };

  const onNegociationReply = (reply: Reply) => {
    if (user.role === Role.Customer) return;
    const raceId = user.currentRaceId!;
    const price: number = +reply.value;
    const accepted = price != race.price;
    sendMessage(raceId, {
      _id: generateId(raceId),
      text: reply.title[0] + ' ' + price + ' ' + user.currency || 'GNF',
      createdAt: Date.now(),
      system: true,
      user: chatUser,
    });
    if (accepted) updateRacePrice(raceId, price);
  };

  return (
    <View style={{ flex: 1 }}>
      <NegociateModal
        intialPrice={race.price}
        setNewPrice={negociatePrice}
        currency={user.currency || 'GNF'}
        visible={negociateModalVisible}
        setVisible={setNegociateModalVisible}
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        onQuickReply={(replies) => onNegociationReply(replies[0])}
        user={chatUser}
        locale='fr'
        placeholder='Taper un message...'
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{
              left: {
                color: COLORS.black,
              },
              right: {
                color: theme.colors.background,
              },
            }}
            wrapperStyle={{
              left: {
                borderColor: COLORS.grey,
                borderWidth: 1,
              },
              right: {
                backgroundColor: theme.colors.primary,
                // color: COLORS.black,
              },
            }}
          />
        )}
        renderActions={() =>
          user.role === Role.Customer && (
            <TouchableOpacity
              style={[
                {
                  borderRadius: 100,
                  marginLeft: 5,
                  borderWidth: 2,
                  borderColor: theme.colors.text,
                },
              ]}
              onPress={() => setNegociateModalVisible(true)}
            >
              <MaterialIcons
                name="attach-money"
                size={40}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )
        }
        quickReplyStyle={[
          user.role === Role.Customer ? { right: '100%' } : { left: '100%' },
        ]}
        renderSystemMessage={(props) => (
          <View>
            <Text style={[commonStyle.text, { textAlign: 'center' }]}>
              {props.currentMessage?.text}
            </Text>
          </View>
        )}
        renderSend={(props) => {
          return (
              <Send
                  {...props}
              >
                  <View style={{marginRight: 10, marginBottom: 10}}>
                      <SendIcon height={25} width={25}/>
                  </View>
              </Send>
          );
      }}
      />
    </View>
  );
}
