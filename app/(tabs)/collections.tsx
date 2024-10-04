import { Text, View, Pressable, Button, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";
import CollectionEntry from "@/components/CollectionEntry";
import ConfirmModal from "@/components/ConfirmationModal";

export default function Tab(){
    const [collectionEntries, setCollections] = useState([] as any[]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [cachedCollection, setCachedCollection] = useState(-1 as number);
    const local = useLocalSearchParams();

    //retrieve the current collections data from the database
    async function prepareCollectionView(){
        try{
            const result = await CardDatabase.getCollectionTotals();
            console.log(`Collection Result: ${JSON.stringify(result)}`);

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
    }, []);

    function handleDeletePrompt(c_id: number){
        setCachedCollection(c_id);
        setConfirmModalVisible(true);
    }

    function handleDeleteConfirm(c_id: number){

    }

    return (
        <View style = {styles.main} >
            <ConfirmModal
                isVisible = { confirmModalVisible }
                headerMessage = { `Delete Collection?` } 
                bodyMessage = { `This will also delete any cards within this collection.` } 
                confirmHandler = { () => function(){ handleDeleteConfirm(cachedCollection); setConfirmModalVisible(false); } }
                cancelHandler = { () => function(){ setConfirmModalVisible(false); } }
            />
            <FlatList 
                data = {collectionEntries}
                renderItem ={({item}) => CollectionEntry(item.c_id, item.name, item.total_cards)}
            />
        </View>
    );
}