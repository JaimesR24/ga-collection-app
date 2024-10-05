import React, { useState, } from 'react';
import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { styles } from "@/scripts/Styles";
import CustomButton from './CustomButton';

export default function TextInputModal({isVisible, headerMessage, bodyMessage, confirmHandler, cancelHandler}: {isVisible: boolean, headerMessage: string, bodyMessage: string, confirmHandler: Function, cancelHandler: Function}){
    const [textField, setTextField] = useState("");
    return (
        <Modal
            animationType = "fade"
            transparent = { true }
            visible = { isVisible }
            onRequestClose = { function(){ cancelHandler(); setTextField(""); }}
        >
            <View style = { styles.modalBackdrop }>
                <View style = { styles.modalView }>
                    <Text style = { styles.modalHeader }>{headerMessage}</Text>
                    <Text style = { styles.modalBody }>{bodyMessage}</Text>
                    <TextInput
                        style={styles.modalInput} 
                        onChangeText={setTextField} 
                        value = {textField} 
                        defaultValue = "Input..." 
                        onSubmitEditing={ () => null }
                    />
                    <View style = {{flexDirection: "row", marginTop: 10}}>
                        <CustomButton
                            title = { "Confirm" }
                            onPress ={ () => { confirmHandler(textField); setTextField(""); }}
                        />
                        <CustomButton
                            title = { "Cancel" }
                            onPress = { () => { setTextField(""); cancelHandler(); }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}