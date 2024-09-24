import { Text, TextInput, View, FlatList, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from 'react';
import { styles } from '@/scripts/Styles';
import { GA_nameSearchURL, GA_advancedSearchURL, GA_cardImageURL } from "@/scripts/GA_IndexRequests";
import GA_CardEntry from '@/components/GA_CardEntry';
import { APICardData } from "@/scripts/GA_Definitions";
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";

export enum SearchMode {Index, Collection};

export default function Tab(){
    const local = useLocalSearchParams();
    const [searchResults, setSearchResults] = useState([] as any[]);
    const [searchParameters, setSearchParameters] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Index);
    const [currentCollection, setCollection] = useState(null as number | null);
    const [hasInitialized, setInitState] = useState(false);

    useLayoutEffect(() => {
        console.log("Layout effect...");
        if (!hasInitialized && local){
            console.log(`Id... ${JSON.stringify(local.c_id)}`);
            console.log(`Search Mode... ${JSON.stringify(local.mode)}`);
            setCollection(Number(local.c_id as string)|| null);
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

    return (
        <View style = {styles.main}>
            <TextInput 
                style={styles.textInput} 
                onChangeText={setSearchParameters} 
                value = {searchParameters} 
                defaultValue = "Search..." 
                onSubmitEditing={() => searchMode == SearchMode.Index ? getAPICardlist() : getCollectionCardlist()}
            />
            <FlatList 
                data = {searchResults}
                renderItem ={({item}) => GA_CardEntry(item)}
            />

        </View>
    );
}