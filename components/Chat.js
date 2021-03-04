import React from 'react';
import { Bubble, Day, GiftedChat, SystemMessage } from 'react-native-gifted-chat'
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      messages: [],
    }
  }

  // Mock messages
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `Hi ${this.props.route.params.name}, welcome to the chat.`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  // Append new message to be displayed
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  // Change system message style
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
        }}
      />
    );
  }

  // Change date style
  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
        }}
      />
    );
  }

  // Change bubble style
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#757083'
          }
        }}
      />
    )
  }

  render() {
    // Define props passed from Start screen
    const { name, color } = this.props.route.params;
    const keyboardVerticalOffset = Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null;

    // Populate user's name, if entered
    this.props.navigation.setOptions({ title: name });

    return (
      // Sets colorChoice from Start screen as Chat screen background color
      <View
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderDay={this.renderDay.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}
