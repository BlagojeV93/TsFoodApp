import React from 'react';
import {
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

interface ButtonProps {
  onTap: () => void;
  width: number;
  height: number;
  title: string;
  isNoBg?: boolean;
  disabled?: boolean;
}

const ButtonWithTitle: React.FC<ButtonProps> = ({
  onTap,
  title,
  width,
  height,
  isNoBg,
  disabled,
}) => {
  if (isNoBg) {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onTap}
        style={[
          styles.mainContainer,
          {width, height, backgroundColor: 'transparent'},
        ]}>
        <Text style={[styles.text, {color: disabled ? '#6F6F6F' : '#3980D9'}]}>{title}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onTap}
      style={[styles.mainContainer, {width, height}]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
    backgroundColor: '#f14b5d',
    marginTop: 20,
    borderRadius: 30,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export {ButtonWithTitle};
