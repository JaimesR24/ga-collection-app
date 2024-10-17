import { Text, View, Modal, Pressable, Button, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { styles } from '@/scripts/Styles';
import CustomButton from "@/components/CustomButton";
import * as CardDatabase from "@/scripts/Database";
import ConfirmModal from "@/components/ConfirmationModal";
import * as Clipboard from "expo-clipboard";

export default function Tab(){
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [portModalVisible, setPortModalVisible] = useState(false);
    const [isExporting, setExporting] = useState(false);

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

    async function handleExport(){
        try{
            await Clipboard.setStringAsync(await CardDatabase.exportDatabase());
        }
        catch (error){ console.log(error); }
        finally{ setPortModalVisible(false); }
    }

    async function handleImport(merge: boolean = false){
        try{
            await CardDatabase.importDatabase(await Clipboard.getStringAsync(), merge);
        }
        catch (error){ console.log(error); }
        finally{ setPortModalVisible(false); }
    }

    return (
        <View style = {styles.main}>
            <ConfirmModal
                isVisible = { confirmModalVisible }
                headerMessage = { `Reset Collections?` } 
                bodyMessage = { `This will also delete all collections and all cards saved.` } 
                confirmHandler = { handleReset }
                cancelHandler = { handleCancel }
            />
            <Modal
                animationType = "fade"
                transparent = { true }
                visible = { portModalVisible }
                onRequestClose = { () => setPortModalVisible(false) }
            >
                <View style = { styles.modalBackdrop }>
                    <View style = { styles.modalView }>
                        <Text style = { styles.modalHeader }>{ isExporting ? "Export Data" : "Import Data"}</Text>
                        <Text style = { styles.modalBody }>{ isExporting ? "The information will be copied to your clipboard." : "The data will be taken from your copied clipboard."}</Text>
                        <View style = {{flexDirection: "row", marginTop: 10}}>
                            <CustomButton
                                title = { isExporting ? "Export" : "Import" }
                                onPress ={ isExporting ? handleExport : handleImport }
                            />
                            <CustomButton
                                title = { "Cancel" }
                                onPress ={ () => setPortModalVisible(false) }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomButton
                title = "Reset Collections"
                onPress = { () => setConfirmModalVisible(true) }
            />
            <CustomButton
                title = "Export Data"
                onPress = { () => {setPortModalVisible(true); setExporting(true);} }
            />
            <CustomButton
                title = "Import Data"
                onPress = { () => {setPortModalVisible(true); setExporting(false);} }
            />
        </View>
    );
}