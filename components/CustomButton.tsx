import { Text, Pressable, Image } from "react-native";
import React from 'react';
import { styles } from "@/scripts/Styles";

export default function CustomButton({title, onPress, disabled = false, imageSrc = null, buttonStyle = styles.button, textStyle = styles.insideText} : {title: string, onPress: Function, disabled?: boolean, imageSrc?: any, buttonStyle?: any, textStyle?: any}){
    return (
        <Pressable
            onPress= { () => onPress() }
            disabled = { disabled }
            style = {({pressed}) => [buttonStyle, {
                backgroundColor: disabled ? "gray" : pressed ? "red" : null,
            }]}
        >
            {!imageSrc ?
            <Text style = {[textStyle, {
                color: "white"
            }]}>{title}</Text> :
            <Image
                source = { imageSrc }
                style = {styles.iconImage}
            />
            }
            
        </Pressable>
    );
}
/*
            {({pressed}) => (
                
            )}
*/