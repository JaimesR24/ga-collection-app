import { View, Text, Button, Pressable, FlatList } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';

export default function GA_EditionBox({card}: {card: APICardData}){
    const [editionCounts, setEditionCounts] = useState([]);

    function handleAddClick (prefix: string){
        console.log("Add");
    }
    function handleSubClick (prefix: string){
        console.log("Sub");
    }

    return (
        <View style = { styles.flexibleBox }>
            <FlatList 
                data = {card.editions}
                renderItem ={({item}) => GA_EditionEntry(item, handleAddClick, handleSubClick)}
                scrollEnabled = { false }
            />
        </View>
    )
}

