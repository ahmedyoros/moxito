import React from 'react';
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
    return {
      name: this.props.navigation.state.params.name,
      _id: Fire.shared.uid,
    };
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={{
          _id:this.user._id!,
          name:this.user.name
        }}
      />
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
