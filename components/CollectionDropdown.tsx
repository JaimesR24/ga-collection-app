import React, { useState, useLayoutEffect, } from 'react';
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
//currently used in the search and [ga_card] routes
export default function CollectionDropdown({collection_id, changeHandler, requestRefresh = false}: {collection_id: number | null, changeHandler: Function, requestRefresh?: boolean}){
    const [collectionData, setCollectionData] = useState([] as any[]);

    async function setupCollectionList(){
        try{
            const result = await CardDatabase.getCollections(true) as any[];
            //console.log(`Collection List... ${JSON.stringify(result)}`);
            setCollectionData(result);
        }
        catch (error) { console.log(error); }
        finally{
            requestRefresh = false;
        }
    }

    useLayoutEffect(() => {
        if (collectionData.length == 0 || requestRefresh) setupCollectionList();
    }, [collection_id, requestRefresh]);

    return (
        <Dropdown
            style = { styles.dropdown }
            placeholderStyle = { styles.text }
            selectedTextStyle = { styles.text }
            containerStyle = { styles.dropdownContainer }
            itemTextStyle = { styles.text }
            inputSearchStyle = { styles.text }
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