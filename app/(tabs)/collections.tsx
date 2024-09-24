import { Text, View, Pressable, Button, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";
import CollectionEntry from "@/components/CollectionEntry";

export default function Tab(){
    const [collectionEntries, setCollections] = useState([] as any[]);
    const [cachedCollections, setCachedColl] = useState([] as any[]);
    const local = useLocalSearchParams();

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

    return (
        <View style = {styles.main} >
            <FlatList 
                data = {collectionEntries}
                renderItem ={({item}) => CollectionEntry(item.c_id, item.name, item.total_cards)}
            />
        </View>
    );
}