import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { IMessage } from 'react-native-gifted-chat';
import { racesRef } from './RaceManager';
import { getBaseUser } from './UserManager';

const getChatRef = (raceId: string) => {
  return racesRef.doc(raceId).collection('messages');
};

export const useChat = (raceId: string): [IMessage[], boolean] => {
  const chatRef = getChatRef(raceId);
  const userId = getBaseUser().id;
  const [messages, loading] = useCollectionData<IMessage>(
    chatRef.orderBy('createdAt', 'desc')
  );
  if (loading || !messages) return [[], true];

  messages.map((m) => {
    if (hasNotRecieved(m, userId))
      chatRef.doc(m._id + '').update({ received: true });
  });
  return [messages, false];
};

export const sendMessage = (raceId: string, newMessage: IMessage, callback?: () => void) => {
  const message: IMessage = {
    ...newMessage,
    sent: true,
    received: false,
  };
  const chatDoc = getChatRef(raceId).doc(newMessage._id + '');

  chatDoc.set(message).then(() => callback && callback());
};

export const useUnreadMessagesCount = (raceId: string, senderId: string): [number, boolean] => {
  const chatRef = getChatRef(raceId);
  const [snapshots, loading] = useCollection(
    chatRef.where('user._id', '==', senderId).where('received', '==', false)
  );
  if (loading) return [0, true];
  return [snapshots ? snapshots.size : 0, false];
};

export const generateId = (raceId: string): string =>
  getChatRef(raceId).doc().id;

function hasNotRecieved(message: IMessage, userId: string) {
  return message.user._id != userId && !message.received;
}
