import { Text, View, Pressable, Button} from "react-native";
import React, { useState } from 'react';
import { Styles } from '@/scripts/Styles';

export default function Index() {
  return (
    <View style={Styles().main}>
      <Text style={[Styles().title, Styles().text]}>Welcome to Grand Archive Collection.</Text>
    </View>
  );
}