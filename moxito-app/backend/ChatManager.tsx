import { useCollectionData } from 'react-firebase-hooks/firestore';
import { IMessage } from 'react-native-gifted-chat';
import { racesRef } from './RaceManager';

const getChatRef = (raceId: string) => {
  return racesRef
    .doc(raceId)
    .collection('messages');
};

export const useChat = (raceId: string): [IMessage[], boolean] => {
  const [messages, loading] = useCollectionData<IMessage>(
    getChatRef(raceId).orderBy('createdAt', 'desc')
  );
  if (loading) return [[], true];
  return [messages!, false];
};

export const sendMessage = (raceId: string, newMessage: IMessage) => {
  const chatRef = getChatRef(raceId);
  chatRef.add(newMessage);
};
