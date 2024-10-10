import React, { useState, useEffect, } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';
import { Dropdown } from 'react-native-element-dropdown';

/*
    Pass state handler function to this component, but let it build its own collectionData.
    Essentially, currentCollection should be tracked by the parent component,
    collectionData is only necessary for the dropdown so that's all it needs to track
    make sure the c_id in the value prop actually works as intended, feel like that's a potential bug
*/

//a component intended to be used specifically for changing the current selected collection. the changeHandler is meant to be actually changing the c_id parameter via the parent component.
//current used in the search and [ga_card] routes
export default function CollectionDropdown({collection_id, changeHandler, requestRefresh = false}: {collection_id: number | null, changeHandler: Function, requestRefresh?: boolean}){
    const [collectionData, setCollectionData] = useState([] as any[]);

    async function setupCollectionList(){
        if (collectionData.length == 0){
            try{
                const result = await CardDatabase.getCollections(true) as any[];
                //console.log(`Collection List... ${JSON.stringify(result)}`);
                setCollectionData(result);
            }
            catch (error) { console.log(error); }
        }
        else {
            //instead of using the database again, just create a new array from the same information and change it
            //a bit inefficient of a method to refresh the dropdown, but without a proper setValue() method or prop then this is the next best thing
            setCollectionData(JSON.parse(JSON.stringify(collectionData)));
            requestRefresh = false;
        }
    }

    useEffect(() => {
        if (collectionData.length == 0 || requestRefresh) setupCollectionList();
    }, [requestRefresh]);

    return (
        <Dropdown
            style = { styles.dropdown }
            placeholderStyle = { styles.text }
            selectedTextStyle = { styles.text }
            containerStyle = { styles.dropdownContainer }
            itemTextStyle = { styles.text }
            activeColor = "gray"
            data = { collectionData }
            maxHeight = {300}
            search
            labelField = "name"
            valueField = "c_id"
            placeholder = { collection_id ? "Select Collection" : "Total" }
            searchPlaceholder = "Search..."
            value = { collection_id }
            onChange = { item => changeHandler(item.c_id, item.name) }
        />
    );
}