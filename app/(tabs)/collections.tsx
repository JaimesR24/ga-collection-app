import { View, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';
import CollectionEntry from "@/components/CollectionEntry";
import ConfirmModal from "@/components/ConfirmationModal";
import TextInputModal from "@/components/TextInputModal";
import { useIsFocused } from "@react-navigation/native";

export default function Tab(){
    const [collectionEntries, setCollections] = useState([] as any[]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [cachedCollection, setCachedCollection] = useState(null as number | null);
    const isFocused = useIsFocused();

    //retrieve the current collections data from the database
    async function prepareCollectionView(){
        try{
            const result = await CardDatabase.getCollectionTotals();
            //console.log(`Collection Result: ${JSON.stringify(result)}`);

            let temp = [] as any[];
            var total = 0;
            for(var entry of result) total += (entry as any).total_cards;
            temp[0] = {
                c_id: null,
                name: "Total Collection",
                total_cards: total
            }
            setCollections([...temp,...result]);
        }
        catch(error) { console.error(error); }
    }

    useEffect(() => {
        prepareCollectionView();
    }, [isFocused]);

    function handleEditPrompt(c_id: number | null){
        setCachedCollection(c_id);
        setEditModalVisible(true);
    }

    function handleDeletePrompt(c_id: number | null){
        setCachedCollection(c_id);
        setConfirmModalVisible(true);
    }

    async function handleEditConfirm(name: string){
        try{
            if (cachedCollection) await CardDatabase.editCollection(cachedCollection, name);
            else await CardDatabase.addCollection(name); 
            await prepareCollectionView();
        }
        catch(error) { console.error(error); } 
        finally { 
            handleCancel();
        }
    }

    async function handleDeleteConfirm(){
        if (cachedCollection == null) return;
        try{
            await CardDatabase.deleteCollection(cachedCollection);
            await prepareCollectionView();
        }
        catch(error) { console.error(error); }
        finally { 
            handleCancel();
        }
    }

    async function handleCancel(){
        setEditModalVisible(false);
        setConfirmModalVisible(false);
        setCachedCollection(null);
    }

    //add a button that calls handleEditPrompt(null)
    return (
        <View style = {styles.main} >
            <TextInputModal
                isVisible = { editModalVisible }
                headerMessage = { cachedCollection ? `Edit Collection` : `Add Collection`} 
                bodyMessage = { `Input new name.` } 
                confirmHandler = { (str: string) => handleEditConfirm(str) }
                cancelHandler = { handleCancel }
            />
            <ConfirmModal
                isVisible = { confirmModalVisible }
                headerMessage = { `Delete Collection?` } 
                bodyMessage = { `This will also delete any cards within this collection.` } 
                confirmHandler = { handleDeleteConfirm  }
                cancelHandler = { handleCancel }
            />
            <FlatList 
                data = {collectionEntries}
                renderItem ={({item}) => CollectionEntry(item.c_id, item.name, item.total_cards, () => handleEditPrompt(item.c_id), () => handleDeletePrompt(item.c_id))}
            />
        </View>
    );
}