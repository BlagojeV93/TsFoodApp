import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

interface ButtonAddRemoveProps {
  onAdd: Function;
  unit: number;
  onRemove: Function;
}

const ButtonAddRemove: React.FC<ButtonAddRemoveProps> = ({
  onAdd,
  onRemove,
  unit,
}) => {
  if (!unit) {
    return (
      <TouchableOpacity style={styles.mainContainer} onPress={() => onAdd()}>
        <Text>Add</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.optionsView}>
      <TouchableOpacity style={styles.btnPlusMinus} onPress={() => onRemove()}>
        <Text style={styles.plusMinusText}>-</Text>
      </TouchableOpacity>
      <View style={styles.unitContainer}>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
      <TouchableOpacity style={styles.btnPlusMinus} onPress={() => onAdd()}>
        <Text style={styles.plusMinusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#f15b5b',
  },
  addText: {
    fontSize: 18,
    color: 'white',
  },
  optionsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plusMinusText: {
    fontSize: 20,
    color: '#f14b5d',
  },
  btnPlusMinus: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f14b5d',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 50,
    width: 30,
  },
  unitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  unitText: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    color: '#f14b5d',
  },
});

export {ButtonAddRemove};
