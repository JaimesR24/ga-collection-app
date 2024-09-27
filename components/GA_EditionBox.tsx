import { View, Text, Button, Pressable, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData, APICardEdition, isKickstarter, Rarity } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';
import * as CardDatabase from '@/scripts/Database';
import CollectionDropdown from './CollectionDropdown';
import CustomButton from './CustomButton';

export default function GA_EditionBox({card, collection, imageHandler}: {card: APICardData, collection: number | null, imageHandler: Function}){
    const [editionQuantities, setEditionQuantities] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    const [cachedEQ, setCachedEQ] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    const [currentCollection, setCollection] = useState(null as number | null);
    const [updateDisabled, setUpdateDisabled] = useState(true);
    const [hasInitialized, setInitState] = useState(false);

    async function prepareBox(){
        try {
            if (!card.slug) {
                console.log("Card data not yet loaded.");
                return; 
            }
            //console.log(`Preparing box with args: slug = ${card.slug}, col = ${currentCollection}`);
            const result = await CardDatabase.getEditionCards(card.slug, currentCollection) as any[];
            var temp = new Array<{edition: APICardEdition, quantity: number}>();
            if (card.editions){
                //read quantity from database
                //console.log(`Obtained result = ${JSON.stringify(result)}`);
                for(var ed of card.editions) {
                    var currentQuantity;
                    //if nothing came back, automatically set to -1

                    if (result == null) currentQuantity = -1;
                    //search for the quantity
                    else currentQuantity = result.find((element) => element.set_prefix == ed.set.prefix && 
                                                                    element.rarity == ed.rarity && 
                                                                    isKickstarter(element.slug) == isKickstarter(ed.slug))?.quantity; 
                    //in the event that no entry could be found, set it to 0 since a failed find() returns null
                    //console.log(`Pushing edition entry... ${ed.set.name}, ${currentQuantity > 0 ? currentQuantity : 0}`);
                    temp.push({edition: ed, quantity: currentQuantity > 0 ? currentQuantity : 0});
                }
            }
            setCachedEQ(JSON.parse(JSON.stringify(temp)));
            setEditionQuantities(JSON.parse(JSON.stringify(temp)));
        }
        catch(error) { console.log(error); }
    }

    useEffect(() => {
        if (!hasInitialized){
            console.log(`Initializing collection... ${collection}`);
            setCollection(Number.isNaN(collection) ? null : collection);
            setInitState(true);
        }
        else{
            //only prepareBox after the initial call, otherwise it would call prepareBox() twice on startup
            prepareBox();
        }
    }, [card.slug, card.editions, currentCollection]);

    useEffect(() => {
        //only call this when edition quantities is updated via handlePress(), and not via prepareBox()
        setUpdateDisabled(!hasChangedValues());
    }, [editionQuantities]);

    function handlePress(prefix:string, editionSlug: string, rarity: Rarity, adding: boolean){
        //console.log(adding ? "add" : "sub");
        var tempObj = JSON.parse(JSON.stringify(editionQuantities)) as Array<{edition: APICardEdition, quantity: number}>;

        var entryIndex = tempObj.findIndex((element) => element.edition.set.prefix == prefix &&
                                                        element.edition.rarity == rarity &&
                                                        isKickstarter(element.edition.slug) == isKickstarter(editionSlug));
        //console.log(`Checking to see if the prefix ${prefix} exists within editionQuantities, received index = ${entryIndex}`);
        if (entryIndex != -1){
            var entry = tempObj[entryIndex];
            //not allowed to go below 0
            entry.quantity = Math.max(0, entry.quantity + (adding ? 1 : -1));
            tempObj[entryIndex] = entry;
            setEditionQuantities(tempObj);
        
        }
        else console.error(`Entry was null.`);
    }

    function handleDropdownChange(new_id: number | null){
        setCollection(new_id);
    }

    //intended to be called to show an alert when switching collections informing the user that their previous changes will not be saved if they switch
    //"Are you sure you want to switch to _? Your previous changes will be lost."
    function hasChangedValues(){
        //return if the values from the database query are the same as the current values in the state
        if (!editionQuantities || !cachedEQ) return false;
        if (editionQuantities.length != cachedEQ.length) {
            console.error(`Cached quantites != modified quantities.`);
            return false;
        }
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
        for (let index = 0; index < cachedArr.length; index++){
            //console.log(`Checking if element ${cachedArr[index].edition.set.name} has changed values... Cached = ${cachedArr[index].quantity}, Mod = ${moddedArr[index].quantity}`);
            if (cachedArr[index].edition.set.prefix == moddedArr[index].edition.set.prefix && 
                cachedArr[index].quantity != moddedArr[index].quantity) return true;
        }
        return false;
    }

    async function updateQuantities(){
        if (!currentCollection) { console.error(`Error: No collection set when trying to modify cards!`); return; }
        for(var entry of editionQuantities){
            try{ await CardDatabase.modifyCards(currentCollection as number, card, entry.edition, entry.quantity); }
            catch(error) { console.error(error); return; }
        }
        setCachedEQ(JSON.parse(JSON.stringify(editionQuantities)));
    }

    return (
        <View style = { styles.flexibleBox }>
            <ScrollView horizontal = { true } scrollEnabled = { false }>
                <CollectionDropdown c_id = { currentCollection } changeHandler= { handleDropdownChange } />
                <CustomButton
                    title= "Update Collection"
                    onPress={() => function(){ updateQuantities()} }
                    disabled = { updateDisabled }
                />
            </ScrollView>
            <FlatList 
                data = { editionQuantities }
                extraData = { editionQuantities }
                ItemSeparatorComponent= {() => (<View style = {{borderBottomColor: "white", borderBottomWidth: 1}}/>) }
                renderItem ={({item}) => <GA_EditionEntry 
                                            edition = { item.edition } 
                                            quantity = { item.quantity != -1 ? `${item.quantity}` : "-" } 
                                            subHandler= { function(){ handlePress(item.edition.set.prefix, item.edition.slug, item.edition.rarity, false) }}
                                            addHandler= { function(){ handlePress(item.edition.set.prefix,item.edition.slug, item.edition.rarity, true) }}
                                            disabled = { currentCollection == null }
                                        />}
                scrollEnabled = { false }
            />
        </View>
    )
}