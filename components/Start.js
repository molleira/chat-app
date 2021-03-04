import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      colorChoice: '',
      colors: ['#090C08', '#474056', '#8A95A5', '#B9C6AE'],
    };
  }

  render() {
    const { navigation } = this.props;
    const { name, colors, colorChoice } = this.state;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 'height';
    const background = require('../assets/img/background-img.png');

    return (
      // background image
      <ImageBackground
        style={styles.background}
        resizeMode='cover'
        source={background}
      >

        {/* moves box out of the way of the keyboard */}
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior="height"
          title='Chat App'
        >

          {/* app title */}
          <Text
            style={styles.title}>
            Chat App
            </Text>

          {/* box for other start components */}
          <View
            style={styles.box}>

            {/* allows to input user name */}
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => this.setState({ name })}
              value={name}
              placeholder='Your Name'
            />

            <Text style={styles.text}>Choose Background Color:</Text>
            {/* Create buttons for user to select background color, store as state to pass to Chat screen */}
            <View style={styles.colorContainer}>
              {colors.map((color) => (
                <View style={[styles.colorBorder, colorChoice === color ? { borderColor: color } : null]} key={color}>
                  <TouchableOpacity onPress={() => this.setState({ colorChoice: color })} style={[styles.colorButton, { backgroundColor: color }]} />
                </View>
              ))}
            </View>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel='Chat button'
              accessibilityHint='Navigate to chat screen'
              accessibilityRole='button'
              style={styles.btnContainer}
            >
              <Text
                style={styles.btnChat}
                onPress={() => navigation.navigate('Chat', { name: name, color: colorChoice })}
              >
                Start Chatting
            </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView >
      </ImageBackground >
    )
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 45,
    // fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
  },
  background: {
    flex: 1,
  },
  box: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 5,
    margin: 20,
    padding: 10,
    width: '88%',
    backgroundColor: '#fff',
    textAlign: 'left',
    position: 'absolute',
    bottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  selectedColor: {
    marginBottom: 10,
    marginLeft: 20,
    color: '#757083',
    fontWeight: '300',
  },
  textInput: {
    height: 50,
    width: '90%',
    borderColor: '#2A323C',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  inputContainer: {
    flex: 0.3,
    width: '100%',
    marginBottom: 10,
  },
  bgColorContainer: {
    flex: 0.5,
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
  },
  color1: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#090C08',
    marginRight: 10,
    marginTop: 10,
  },
  color2: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#474056',
    marginRight: 10,
    marginTop: 10,
  },
  color3: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#8A95A5',
    marginRight: 10,
    marginTop: 10,
  },
  color4: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#B9C6AE',
    marginRight: 10,
    marginTop: 10,
  },
  btnChat: {
    fontSize: 16,
    // fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    color: '#fff',
    padding: 20,
    textAlign: 'center',
  },
  btnContainer: {
    backgroundColor: '#757083',
    width: '88%',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 15,
    marginBottom: 10,
  },

  colorContainer: {
    flex: 4,
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 5,
  },
  colorButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  colorBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 100,
    padding: 3,
  },
})
