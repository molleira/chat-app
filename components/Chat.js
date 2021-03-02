import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  render() {
    // Define props passed from Start screen
    const { name, color } = this.props.route.params;

    // Populate user's name, if entered
    this.props.navigation.setOptions({ title: name });

    return (
      // Sets colorChoice from Start screen as Chat screen background color
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
      </View>
    );
  }
}
