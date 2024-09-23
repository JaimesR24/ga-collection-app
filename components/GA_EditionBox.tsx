import { View, Text, Button, Pressable, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData, APICardEdition } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';
import * as CardDatabase from '@/scripts/Database';
import { Dropdown } from 'react-native-element-dropdown';

export default function GA_EditionBox({card, collection}: {card: APICardData, collection: number | null}){
    const [editionQuantities, setEditionQuantities] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    const [cachedEQ, setCachedEQ] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    const [currentCollection, setCollection] = useState(null as number | null);
    const [collectionData, setCollectionData] = useState([] as any[]);
    const [hasInitialized, setInitState] = useState(false);

    async function prepareBox(){
        try {
            if (!card.slug) {
                console.log("Card data not yet loaded.");
                return; 
            }
            console.log(`Preparing box with args: slug = ${card.slug}, col = ${currentCollection}`);
            const result = await CardDatabase.getEditionCards(card.slug, currentCollection) as any[];
            var temp = new Array<{edition: APICardEdition, quantity: number}>();
            if (card.editions){
                //read quantity from database
                console.log(`Obtained result = ${JSON.stringify(result)}`);
                for(var ed of card.editions) {
                    var currentQuantity;
                    //if nothing came back, automatically set to -1

                    if (result == null) currentQuantity = -1;
                    //search for the quantity
                    else currentQuantity = result.find((element) => element.set_prefix == ed.set.prefix)?.quantity; 
                    //in the event that no entry could be found, set it to 0 since a failed find() returns null
                    temp.push({edition: ed, quantity: currentQuantity != null ? currentQuantity : 0});
                }
            }
            setEditionQuantities(temp);
            setCachedEQ(temp);
        }
        catch(error) { console.log(error); }
    }

    async function setCollectionList(){
        var temp = [{c_id: null as number | null, name: "Total"}];
        try{
            const result = await CardDatabase.getCollections() as any[];
            setCollectionData(temp.concat(result));
        }
        catch (error) { console.log(error); }
    }

    //only call this on the initial render.
    useEffect(() => {
        if (!hasInitialized){
            setCollection(collection as number | null);
            setCollectionList();
            setInitState(true);
        }
        prepareBox();
    }, [card.slug, card.editions, currentCollection]);

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
            /*
            console.log(`Current State:\n`);
            for (var e of tempObj){
                console.log(`Entry: ${e.edition.set.name} - ${e.quantity}`);
            }
            */
        }
        else console.error(`Entry was null.`);
        
    }

    function hasChangedValues(){
        //return if the values from the database query are the same as the current values in the state
        if (editionQuantities.length != cachedEQ.length) console.error(`Cached quantites != modified quantities.`);

        //sort the arrays using their prefix. the elements should already be in order, but this ensures it
        var cachedArr = Array.from(cachedEQ.sort((a,b) => {
            if (a > b) return 1;
            else if (a < b) return -1;
            else return 0;
        }));
        var moddedArr = Array.from(editionQuantities.sort((a,b) => {
            if (a > b) return 1;
            else if (a < b) return -1;
            else return 0;
        }));

        //compare the entries
        for (let index = 0; cachedArr.length; index++){
            if (cachedArr[index].edition.set.prefix == moddedArr[index].edition.set.prefix && 
                cachedArr[index].quantity == moddedArr[index].quantity) return true;
        }
        return false;
    }

    async function updateQuantities(){
        if (!currentCollection) { console.error(`Error: No collection set when trying to modify cards!`); return; }
        for(var entry of editionQuantities){
            try{ await CardDatabase.modifyCards(currentCollection as number, card, entry.edition, entry.quantity); }
            catch(error) { console.error(error); }
        }
    }

    //now i need a button that can extract the state of all the editionEntry components to put them into a query update.

    //renderItem = { item => <Text style = { styles.text }>{item.name}</Text> }
    return (
        <View style = { styles.flexibleBox }>
            <ScrollView horizontal = { true } scrollEnabled = { false }>
                <Dropdown
                    style = { styles.dropdown }
                    data = { collectionData }
                    maxHeight = {300}
                    search
                    labelField = "name"
                    valueField = "c_id"
                    placeholder = "Select collection"
                    searchPlaceholder = "Search..."
                    value = { currentCollection }
                    onChange = { item => setCollection(item.c_id) }
                />
                <Button
                    color = "blue"
                    title= "Update Collection"
                    onPress={() => updateQuantities()}
                />
            </ScrollView>
            <FlatList 
                data = { editionQuantities }
                extraData = { editionQuantities }
                renderItem ={({item}) => <GA_EditionEntry 
                                            edition = { item.edition } 
                                            quantity = { item.quantity != -1 ? `${item.quantity}` : "-" } 
                                            subHandler= { function(){ handlePress(item.edition.set.prefix, false) }}
                                            addHandler= { function(){ handlePress(item.edition.set.prefix, true) }}
                                            disabled = { currentCollection == null }
                                        />}
                scrollEnabled = { false }
            />
        </View>
    )
}