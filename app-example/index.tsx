import { Text, View, Pressable, StyleSheet } from "react-native";
import CardCollection from "../scripts/CardCollection";
import React, { useState } from "react";

export default function Index() {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Listen to the button.</Text>
      <Pressable 
        //title= { isPressed ? "Thank you for pressing." : "Press this."}
        onPress={() => { 
          setIsPressed(true);
          console.log("Pressed.");
        }}
        disabled = {isPressed}
      >
        <Text>{isPressed ? "Thank you for pressing." : "Press this."}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({

});