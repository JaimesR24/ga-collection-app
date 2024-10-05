import React from 'react';
import { View, Text, Pressable, Modal } from "react-native";
import { styles } from "@/scripts/Styles";
import CustomButton from './CustomButton';

export default function ConfirmModal({isVisible, headerMessage, bodyMessage, confirmHandler, cancelHandler}: {isVisible: boolean, headerMessage: string, bodyMessage: string, confirmHandler: Function, cancelHandler: Function}){
    return (
        <Modal
            animationType = "fade"
            transparent = { true }
            visible = { isVisible }
            onRequestClose = { () => cancelHandler() }
        >
            <View style = { styles.modalBackdrop }>
                <View style = { styles.modalView }>
                    <Text style = { styles.modalHeader }>{headerMessage}</Text>
                    <Text style = { styles.modalBody }>{bodyMessage}</Text>
                    <View style = {{flexDirection: "row", marginTop: 10}}>
                        <CustomButton
                            title = { "Confirm" }
                            onPress ={ confirmHandler }
                        />
                        <CustomButton
                            title = { "Cancel" }
                            onPress ={ cancelHandler }
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}