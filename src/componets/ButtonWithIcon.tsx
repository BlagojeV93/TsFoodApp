import React from 'react';
import {
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
} from 'react-native';

interface ButtonProps {
  onTap: () => void;
  width: number;
  height: number;
  icon: ImageSourcePropType;
}

const ButtonWithIcon: React.FC<ButtonProps> = ({
  onTap,
  icon,
  width,
  height,
}) => {
  return (
    <TouchableOpacity
      onPress={onTap}
      style={[styles.mainContainer, {width, height}]}>
      <Image style={{width: width - 2, height: height - 2}} source={icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
  },
});

export { ButtonWithIcon};
