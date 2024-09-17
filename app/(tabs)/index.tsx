import { Text, View, Pressable, Button} from "react-native";
import React, { useState } from 'react';
import { styles } from '@/scripts/Styles';

export default function Index() {
  return (
    <View style={styles.main}>
      <Text style={[styles.title, styles.text]}>Welcome to Grand Archive Collection.</Text>
    </View>
  );
}