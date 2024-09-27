import { Text, TextInput, View, FlatList, StyleSheet, Button, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from 'react';
import { styles } from '@/scripts/Styles';
import { GA_nameSearchURL, GA_advancedSearchURL, GA_cardImageURL } from "@/scripts/GA_IndexRequests";
import GA_CardEntry from '@/components/GA_CardEntry';
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";
import CollectionDropdown from "@/components/CollectionDropdown";

export enum SearchMode {Index, Collection};

export default function Tab(){
    const local = useLocalSearchParams();
    const [searchResults, setSearchResults] = useState([] as any[]);
    const [searchParameters, setSearchParameters] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Index);
    const [currentCollection, setCollection] = useState(null as number | null);
    const [hasInitialized, setInitState] = useState(false);

    useLayoutEffect(() => {
        if (!hasInitialized && local){
            console.log(`Id... ${JSON.stringify(local.c_id)}`);
            console.log(`Search Mode... ${JSON.stringify(local.mode)}`);
            setCollection(Number(local.c_id as string) || null);
            setSearchMode(Number(local.mode as string) as SearchMode || SearchMode.Index);
            setInitState(true);
        }

        if (searchMode == SearchMode.Collection){
            getCollectionCardlist();
        }
        else setSearchResults([]);

    }, [searchMode, currentCollection]);

    async function getAPICardlist(){
        var URL = '';
        if (typeof searchParameters == 'string') URL = GA_nameSearchURL(searchParameters);
        else URL = GA_advancedSearchURL(searchParameters);

        var json;
        var page_number = 1;
        var final_data;
        while (page_number == 1 || json?.has_more){
            var newURL = URL + `&page=${page_number}`;
            try {
                console.log(`Search attempting to fetch with this url: ${newURL}`);
                const response = await fetch(newURL);
                json = await response.json();
                final_data = page_number == 1 ? json.data : [...final_data || [], ...json.data];
                page_number++;
            }
            catch(error){
                console.error(`Invalid JSON Output: ${error}`);
                break;
            }
        }
        setSearchResults(final_data);
        //console.log(JSON.stringify(final_data));
    }

    async function getCollectionCardlist(){
        //access the database
        try{
            const result = await CardDatabase.getUniqueCards(currentCollection, searchParameters);
            setSearchResults(result);
        }
        catch(error) { console.error(error); }
    }
    
    function handleDropdownChange(new_id: number | null){
        setCollection(new_id);
    }

    function toggleSearchMode(){
        setSearchMode(searchMode == SearchMode.Collection ? SearchMode.Index : SearchMode.Collection);
    }

    return (
        <View style = {styles.main}>
            <ScrollView horizontal = { true } scrollEnabled = { false }>
                <Text style = { styles.text }>Searching through...</Text>
                <Button
                    color = "white"
                    title= "Collection"
                    onPress={() => toggleSearchMode()}
                    disabled = { searchMode == SearchMode.Collection }
                />
                <Button
                    color = "white"
                    title= "Index"
                    onPress={() => toggleSearchMode()}
                    disabled = { searchMode == SearchMode.Index }
                />

            </ScrollView>
            {searchMode == SearchMode.Collection ? <CollectionDropdown c_id = { currentCollection } changeHandler= { handleDropdownChange }/> : null }
            <TextInput 
                style={styles.textInput} 
                onChangeText={setSearchParameters} 
                value = {searchParameters} 
                defaultValue = "Search..." 
                onSubmitEditing={() => searchMode == SearchMode.Index ? getAPICardlist() : getCollectionCardlist()}
            />
            <FlatList 
                data = {searchResults}
                extraData = {currentCollection}
                renderItem ={({item}) => GA_CardEntry(item, searchMode == SearchMode.Collection ? currentCollection : null)}
            />

        </View>
    );
}
//consider nulling the flatlist to a simple "No results." when searchResults is empty
//replace Buttons with pressables since you can't really customize or style the button itself very easily.
//perhaps make a custom button component that is really a pressable with a default styling