import { View, Text, Button, Pressable, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';
import { Dropdown } from 'react-native-element-dropdown';

/*
    Pass state handler function to this component, but let it build its own collectionData.
    Essentially, currentCollection should be tracked by the parent component,
    collectionData is only necessary for the dropdown so that's all it needs to track
    make sure the c_id in the value prop actually works as intended, feel like that's a potential bug
*/

export default function CollectionDropdown({c_id, changeHandler}: {c_id: number | null, changeHandler: Function}){
    const [collectionData, setCollectionData] = useState([] as any[]);

    async function setupCollectionList(){
        try{
            const result = await CardDatabase.getCollections(true) as any[];
            //console.log(`Collection List... ${JSON.stringify(result)}`);
            setCollectionData(result);
        }
        catch (error) { console.log(error); }
    }

    useEffect(() => {
        setupCollectionList();
    }, [c_id]);

    return (
        <Dropdown
            style = { styles.dropdown }
            placeholderStyle = { styles.text }
            selectedTextStyle = { styles.text }
            data = { collectionData }
            maxHeight = {300}
            search
            labelField = "name"
            valueField = "c_id"
            placeholder = { c_id ? "Select Collection" : "Total" }
            searchPlaceholder = "Search..."
            value = { c_id }
            onChange = { item => changeHandler(item.c_id) }
        />
    );
}