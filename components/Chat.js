import React from 'react';
import { Bubble, Day, GiftedChat, InputToolbar, SystemMessage } from 'react-native-gifted-chat'
import { KeyboardAvoidingView, Platform, View } from 'react-native';

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

// import AsyncStorage
import AsyncStorage from '@react-native-community/async-storage';

// import NetInfo
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
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
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // check if user is online
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({
          isConnected: true,
        });

        // reference to collection in database
        this.referenceChatMessages = firebase.firestore().collection('messages');

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
              createdAt: new Date(),
            },
            messages: [],
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
        window.alert('You are currently offline and will not be able to send messages.');
      }
    });
  }

  componentWillUnmount() {
    // stop receiving updates
    this.unsubscribe();

    // stop receiving authentication updates
    this.authUnsubscribe();
  }

  // load messages when offline
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // save messages to view offline
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
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
        this.saveMessages();
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

  // hide input bar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
      </View>
    );
  }
}
