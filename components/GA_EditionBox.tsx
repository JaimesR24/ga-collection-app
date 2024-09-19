import { View, Text, Button, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData, APICardEdition } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';
import { Dictionary } from '@/scripts/Utils';

export default function GA_EditionBox({card}: {card: APICardData}){
    const [editionEntries, setEditionEntries] = useState(new Array<React.JSX.Element>());

    //const [editionEntries2, setEditionEntries2] = useState(new Array<{quantity: number, element: React.JSX.Element}>());

    useEffect(() => {
        var temp = new Array<React.JSX.Element>();
        if (card.editions){
            for(var ed of card.editions){
                temp.push(<GA_EditionEntry edition = {ed} />);
            }
        }
        setEditionEntries(temp);
        
    }, [card.editions]);

    //now i need a button that can extract the state of all the editionEntry components to put them into a query update.

    return (
        <View style = { styles.flexibleBox }>
            <FlatList 
                data = {editionEntries}
                renderItem ={({item}) => item}
                scrollEnabled = { false }
            />
        </View>
    )
}