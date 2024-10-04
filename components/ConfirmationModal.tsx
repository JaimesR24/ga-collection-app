import React from 'react';
import { View, Text, Pressable, Modal } from "react-native";
import { styles } from "@/scripts/Styles";

export default function ConfirmModal({isVisible, headerMessage, bodyMessage, confirmHandler, cancelHandler}: {isVisible: boolean, headerMessage: string, bodyMessage: string, confirmHandler: Function, cancelHandler: Function}){
    return (
        <Modal
            animationType = "fade"
            transparent = { true }
            visible = { isVisible }
            onRequestClose = { function(){ cancelHandler() }}
        >
            <View style = { styles.modalBackdrop }>
                <View style = { styles.modalView }>
                    <Text style = { styles.modalHeader }>{headerMessage}</Text>
                    <Text style = { styles.modalBody }>{bodyMessage}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <Pressable 
                            onPress ={ confirmHandler() }
                            style = { styles.button }
                        >
                            <Text style = { styles.insideText }>Confirm</Text>
                        </Pressable>
                        <Pressable 
                            onPress ={ cancelHandler() }
                            style = { styles.button }
                        >
                            <Text style = { styles.insideText }>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}