import { Text, TextInput, View, FlatList, StyleSheet, Button, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from 'react';
import { styles } from '@/scripts/Styles';
import { GA_nameSearchURL, GA_advancedSearchURL, GA_cardImageURL } from "@/scripts/GA_IndexRequests";
import GA_CardEntry from '@/components/GA_CardEntry';
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";
import CollectionDropdown from "@/components/CollectionDropdown";
import CustomButton from "@/components/CustomButton";

export enum SearchMode {Index, Collection};

export default function Tab(){
    const local = useLocalSearchParams();
    const [searchResults, setSearchResults] = useState([] as any[]);
    const [searchParameters, setSearchParameters] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Index);
    const [currentCollection, setCollection] = useState(null as number | null);
    const [hasInitialized, setInitState] = useState(false);
    const [resultInfo, setResultInfo] = useState({currentPage: 0, maxPage: 0, totalResults: 0});

    useLayoutEffect(() => {
        if (!hasInitialized && local){
            //console.log(`Id... ${JSON.stringify(local.c_id)}`);
            //console.log(`Search Mode... ${JSON.stringify(local.mode)}`);
            setCollection(Number(local.c_id as string) || null);
            setSearchMode(Number(local.mode as string) as SearchMode || SearchMode.Index);
            setInitState(true);
        }

        if (searchMode == SearchMode.Collection){
            getCollectionCardlist();
        }
        else setSearchResults([]);

    }, [searchMode, currentCollection]);

    async function getAPICardlist(page_number: number = 1){
        var URL = '';
        if (typeof searchParameters == 'string') URL = GA_nameSearchURL(searchParameters);
        else URL = GA_advancedSearchURL(searchParameters);

        var newURL = URL + `&page=${page_number}`;
        try {
            console.log(`Search attempting to fetch with this url: ${newURL}`);
            const response = await fetch(newURL);
            const json = await response.json();
            setResultInfo({currentPage: page_number, maxPage: json.total_pages, totalResults: json.total_cards});
            setSearchResults(json.data);
        }
        catch(error){
            console.error(`Invalid JSON Output: ${error}`);
        }
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
            <View style = {{maxHeight: 50, flexDirection: "row"}}>
                <CustomButton
                    title= "Collections"
                    onPress={() => function(){ toggleSearchMode() }}
                    disabled = { searchMode == SearchMode.Collection }
                />
                <CustomButton
                    title= "Index"
                    onPress={() => function(){ toggleSearchMode() }}
                    disabled = { searchMode == SearchMode.Index }
                />

            </View>
            {searchMode == SearchMode.Collection ? <CollectionDropdown c_id = { currentCollection } changeHandler= { handleDropdownChange }/> : null }
            <TextInput 
                style={styles.textInput} 
                onChangeText={setSearchParameters} 
                value = {searchParameters} 
                defaultValue = "Search..." 
                onSubmitEditing={() => searchMode == SearchMode.Index ? getAPICardlist() : getCollectionCardlist()}
            />
            { resultInfo.maxPage != 0 && searchResults != null ? 
                <View style = {{alignItems: "center"}}>
                    <Text style = {styles.text}>{`Displaying ${1 + (resultInfo.currentPage - 1) * 50 + (resultInfo.currentPage != 1 ? searchResults.length : 0)}-${searchResults.length  + (resultInfo.currentPage - 1) * 50} of ${resultInfo.totalResults} cards`}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <CustomButton
                            title= "<"
                            onPress={() => function(){ getAPICardlist(resultInfo.currentPage - 1) }}
                            disabled = { resultInfo.currentPage == 1 }
                        />
                        <Text style = {styles.text}>{`Page ${resultInfo.currentPage} of ${resultInfo.maxPage}`}</Text>
                        <CustomButton
                            title= ">"
                            onPress={() => function(){ getAPICardlist(resultInfo.currentPage + 1) }}
                            disabled = { resultInfo.currentPage == resultInfo.maxPage }
                        />
                    </View>
                </View>
                : null
            }
            <FlatList 
                data = {searchResults}
                extraData = {currentCollection}
                renderItem ={({item}) => GA_CardEntry(item, searchMode == SearchMode.Collection ? currentCollection : null)}
            />

        </View>
    );
}
//consider nulling the flatlist to a simple "No results." when searchResults is empty
//consider adding a onRefresh functionality to empty search results while waiting for a new api/database request and show a loading symbol