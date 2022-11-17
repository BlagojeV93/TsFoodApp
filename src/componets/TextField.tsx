import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

interface TextFieldProps {
  placeholder: string;
  isSecure?: boolean;
  onTextChange: (text: string) => void;
  isOtp?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  isSecure,
  onTextChange,
  isOtp = false,
}) => {
  if (isOtp) {
    return (
      <View style={styles.mainContainer}>
        <TextInput
          placeholder={placeholder}
          autoCapitalize="none"
          secureTextEntry={isSecure}
          onChangeText={text => onTextChange(text)}
          style={styles.otpTextField}
          maxLength={6}
        />
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder={placeholder}
        autoCapitalize="none"
        secureTextEntry={isSecure}
        onChangeText={text => onTextChange(text)}
        style={styles.textField}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 340,
    backgroundColor: '#DBDBDB',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: 30,
    paddingRight: 10,
    paddingLeft: 20,
  },
  textField: {
    flex: 1,
    height: 50,
    width: 320,
    fontSize: 20,
    color: 'black',
  },
  otpTextField: {
    flex: 1,
    height: 50,
    width: 320,
    fontSize: 30,
    color: 'black',
    textAlign: 'center'
  },
});

export {TextField};
