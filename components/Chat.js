import React from 'react';
import { Bubble, Day, GiftedChat, SystemMessage } from 'react-native-gifted-chat'
import { KeyboardAvoidingView, Platform, View } from 'react-native';

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
    };

    // firestore settings
    const firebaseConfig = {
      apiKey: "AIzaSyDTe-QLrLnHLMb-4KAtx_Qzy_op9VMF370",
      authDomain: "chat-app-457e5.firebaseapp.com",
      projectId: "chat-app-457e5",
      storageBucket: "chat-app-457e5.appspot.com",
      messagingSenderId: "571811185577"
    }

    // initialize firestore
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // reference to collection in database
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Authenticate user with Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // update user state with currently active user data
      this.setState({
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop receiving updates
    this.unsubscribe();

    // stop receiving authentication updates
    this.authUnsubscribe();
  }

  // add messages to database
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || '',
      user: message.user,
    });
  }

  // Append new message to be displayed
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
        // this.saveMessages();
      }
    );
  }

  // update messages state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

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
          user={this.state.user}
        />
      </View>
    );
  }
}
