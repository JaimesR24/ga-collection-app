import { View, FlatList } from 'react-native';
import React, { useState, useEffect, } from 'react';
import { styles } from '@/scripts/Styles';
import { APICardData, APICardEdition, isKickstarter, Rarity } from '@/scripts/GA_Definitions';
import GA_EditionEntry from '@/components/GA_EditionEntry';
import * as CardDatabase from '@/scripts/Database';
import CollectionDropdown from '@/components/CollectionDropdown';
import CustomButton from '@/components/CustomButton';
import ConfirmModal from '@/components/ConfirmationModal';

export default function GA_EditionBox({card, collection, imageHandler}: {card: APICardData, collection: number | null, imageHandler: Function}){
    //used to make sure a single rerender happens in one of the useEffect() functions
    const [hasInitialized, setInitState] = useState(false);
    //hold all the edition information and quantity of cards in an array for the selected card. this one is updated as the user presses the + and - buttons
    const [editionQuantities, setEditionQuantities] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    //holds the edition information and quantity of cards in an array. this one is a simple cached var, used to check against editionQuantities to see if the values have changed.
    const [cachedEQ, setCachedEQ] = useState(new Array<{edition: APICardEdition, quantity: number}>());
    //holds the current selected collection. this component is granted the initial state from the [ga_card] view, but maintained here since the main view doesn't need to.
    const [currentCollection, setCollection] = useState(null as number | null);
    //the state that maintains where the "Update Collection" button should be available.
    const [updateDisabled, setUpdateDisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [cachedCollectionChange, setCollectionChange] = useState(null as number | null);

    //query the database for the initial values of the card per each edition, save the info.
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

    //the function that actually prepares the edition arrays. whenever currentCollection is updated, immediately call to query the database again based on the new collection.
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
        //card.slug and card.editions are necessary for prepareBox() and may require a moment to properly pass the props
    }, [card.slug, card.editions, currentCollection]);

    //anytime the edition quantities are changed, re-check the state of the "Update Collection" button
    useEffect(() => {
        //only call this when edition quantities is updated via handlePress(), and not via prepareBox()
        setUpdateDisabled(!hasChangedValues());
    }, [editionQuantities, cachedEQ]);

    //handler passed to the + and - buttons on the editions
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

    //handler for the dropdown changes
    function handleDropdownChange(new_id: number | null){
        if (hasChangedValues() && new_id != currentCollection) { 
            setCollectionChange(new_id);
            setModalVisible(true);
        }
        else setCollection(new_id);
    }

    function updateDropdown(new_id: number | null){
        setCollection(new_id);
    }

    function revertDropdown(){
        setCollectionChange(-1);//set to -1 since it's impossible to have as a collection id, signaling it's not used anymore.
    }

    //intended to be called to show an alert when switching collections informing the user that their previous changes will not be saved if they switch
    //"Are you sure you want to switch to _? Your previous changes will be lost."
    //also used to verify whether the "Update Collection" button should be disabled or not
    function hasChangedValues(){
        //return if the values from the database query are the same as the current values in the state
        if ((!editionQuantities || !cachedEQ) || (editionQuantities.length != cachedEQ.length)) return false;
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

    //the handler for the "Update Collection" button which updates the new information into the database.
    async function updateQuantities(){
        if (!currentCollection) { console.error(`Error: No collection set when trying to modify cards!`); return; }
        for(var entry of editionQuantities){
            try{ await CardDatabase.modifyCards(currentCollection as number, card, entry.edition, entry.quantity); }
            catch(error) { console.error(error); return; }
        }
        setCachedEQ(JSON.parse(JSON.stringify(editionQuantities)));
    }

    return (
        <View style = { styles.box }>
            <ConfirmModal
                isVisible = { modalVisible }
                headerMessage = { `Switch Collection?` } 
                bodyMessage = { `Changing collections will discard your current changes.` } 
                confirmHandler = { () => { updateDropdown(cachedCollectionChange); setModalVisible(false); }}
                cancelHandler = { () => { revertDropdown(); setModalVisible(false); }}
            />
            <View style = {{flexDirection: "row"}}>
                <CollectionDropdown collection_id = { currentCollection } changeHandler= { handleDropdownChange } requestRefresh = { cachedCollectionChange == -1 } />
                <CustomButton
                    title = "Update Collection"
                    onPress = { updateQuantities }
                    disabled = { updateDisabled }
                />
            </View>
            <FlatList 
                data = { editionQuantities }
                extraData = { editionQuantities }
                ItemSeparatorComponent = {() => (<View style = {{borderBottomColor: "white", borderBottomWidth: 1}}/>) }
                renderItem = {({item}) => <GA_EditionEntry 
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