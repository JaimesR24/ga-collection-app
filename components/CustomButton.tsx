import { Text, Pressable } from "react-native";
import React from 'react';
import { styles } from "@/scripts/Styles";

export default function CustomButton({title, onPress, disabled, buttonStyle = styles.button, textStyle = styles.insideText} : {title: string, onPress: Function, disabled: boolean, buttonStyle?: any, textStyle?: any}){
    return (
        <Pressable
            onPress= { onPress() }
            disabled = { disabled }
            style = {({pressed}) => [buttonStyle, {
                backgroundColor: disabled ? "gray" : pressed ? "red" : null,
            }]}
        >
            <Text style = {[textStyle, {
                color: "white"
            }]}>{title}</Text>
        </Pressable>
    );
}
/*
            {({pressed}) => (
                
            )}
*/