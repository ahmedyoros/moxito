import firebase from 'firebase';
import React from 'react';
import { Button, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat'; // 0.3.0
import { NavigationScreenProp } from 'react-navigation';

import Fire from '../Fire';

type Props = {
  name?: string,
  navigation: NavigationScreenProp<any,any>
};

type State = { 
  messages: IMessage[] | undefined; 
}

class Chat extends React.Component<Props, State> {

  static navigationOptions = (props: Props) => ({
    title: (props.navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };

  get user() {
    const user:firebase.User = firebase.auth().currentUser!;
    return {
      name: user.displayName!,
      _id: user.uid,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={Fire.shared.send}
          user={{
              _id:this.user._id!,
              name:this.user.name
            }}
        />
        <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
      </View>
      
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, [{
          _id: message._id,
          text: message.text,
          user: message.user,
          createdAt: message.timestamp
        }]),
      }))
    );
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
