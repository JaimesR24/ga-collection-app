import { Text, View, Pressable, Button, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { styles } from '@/scripts/Styles';
import CustomButton from "@/components/CustomButton";
import * as CardDatabase from "@/scripts/Database";
import ConfirmModal from "@/components/ConfirmationModal";

export default function Tab(){
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    async function handleReset(){
        try{
            await CardDatabase.resetDatabase();
        }
        catch (error) { console.error(error); }
        finally { setConfirmModalVisible(false); }
    }

    function handleCancel(){
        setConfirmModalVisible(false);
    }

    return (
        <View style = {styles.main} >
            <ConfirmModal
                isVisible = { confirmModalVisible }
                headerMessage = { `Reset Collections?` } 
                bodyMessage = { `This will also delete all collections and all cards saved.` } 
                confirmHandler = { handleReset }
                cancelHandler = { handleCancel }
            />
            <CustomButton
                title = "Reset Collections"
                onPress = { () => setConfirmModalVisible(true) }
            />
        </View>
    );
}