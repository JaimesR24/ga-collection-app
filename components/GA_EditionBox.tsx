import { View, Text, Button, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData, APICardEdition } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';
import { Dictionary } from '@/scripts/Utils';

export default function GA_EditionBox({card}: {card: APICardData}){
    const [editionQuantities, setEditionQuantities] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    const [currentQuery, setQuery] = useState({});

    useEffect(() => {
        var temp = new Array<{edition: APICardEdition, quantity: number}>();
        if (card.editions){
            //read quantity from database
            var currentQuantity = 0;
            //maybe add some check that confirms if a collection/view has been set. defaults to "Total". when in "Total" mode, disable/hide the buttons.
            for(var ed of card.editions) temp.push({edition: ed, quantity: currentQuantity}); 
        }
        setEditionQuantities(temp);
    }, [card.editions,]);

    function handlePress(prefix:string, adding: boolean){
        //console.log(adding ? "add" : "sub");
        var tempObj = Array.from(editionQuantities);
        var entryIndex = tempObj.findIndex((element) => element.edition.set.prefix == prefix);
        //console.log(`Checking to see if the prefix ${prefix} exists within editionQuantities, received index = ${entryIndex}`);
        if (entryIndex != -1){
            var entry = tempObj[entryIndex];
            //not allowed to go below 0
            entry.quantity = Math.max(0, entry.quantity + (adding ? 1 : -1));
            tempObj[entryIndex] = entry;
            setEditionQuantities(tempObj);
            console.log(`Current State:\n`);
            for (var e of tempObj){
                console.log(`Entry: ${e.edition.set.name} - ${e.quantity}`);
            }
        }
        else console.error(`Entry was null.`);
        
    }

    function hasChangedValues(){
        //return if the values from the database query are the same as the current values in the state
    }

    //now i need a button that can extract the state of all the editionEntry components to put them into a query update.

    return (
        <View style = { styles.flexibleBox }>
            <FlatList 
                data = { editionQuantities }
                extraData = { editionQuantities }
                renderItem ={({item}) => <GA_EditionEntry 
                                            edition = { item.edition } 
                                            quantity = { `${item.quantity}` } 
                                            subHandler= { function(){ handlePress(item.edition.set.prefix, false) }}
                                            addHandler= { function(){ handlePress(item.edition.set.prefix, true) }}
                                        />}
                scrollEnabled = { false }
            />
        </View>
    )
}