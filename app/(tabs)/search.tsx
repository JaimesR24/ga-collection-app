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
    //simple state to only render an effect once
    const [hasInitialized, setInitState] = useState(false);
    //search mode to switch between index or database searches
    const [searchMode, setSearchMode] = useState(SearchMode.Index);
    //holding the current collection id, null gives you everything in all collections
    const [currentCollection, setCollection] = useState(null as number | null);
    //the field where the search parameters are
    const [searchParameters, setSearchParameters] = useState('');
    //the list of results from either the API index or the database
    const [searchResults, setSearchResults] = useState([] as any[]);
    //holds info related to the result that isn't directly used in rendering the result list.
    const [resultInfo, setResultInfo] = useState({currentPage: 0, maxPage: 0, totalResults: 0, pageSize: 0});

    //pass along the props via the local var into the states themselves
    useLayoutEffect(() => {
        if (!hasInitialized && local){
            //console.log(`Id... ${JSON.stringify(local.c_id)}`);
            //console.log(`Search Mode... ${JSON.stringify(local.mode)}`);
            setCollection(Number(local.c_id as string) || null);
            setSearchMode(Number(local.mode as string) as SearchMode || SearchMode.Index);
            setInitState(true);
        }
        //initialize the search results. if collection, get the total. if index, return nothing.
        if (searchMode == SearchMode.Collection) getCollectionCardlist(); 
        else setSearchResults([]);

        //rerender whenever the search mode or collection selection is changed to get the correct search results
    }, [searchMode, currentCollection]);

    //make an API request from the Grand Archive Index to get the desired search results according to the searchParameters var
    async function getAPICardlist(page_number: number = 1){
        var URL = '';
        if (typeof searchParameters == 'string') URL = GA_nameSearchURL(searchParameters);
        else URL = GA_advancedSearchURL(searchParameters);

        var newURL = URL + `&page=${page_number}`;
        try {
            console.log(`Search attempting to fetch with this url: ${newURL}`);
            const response = await fetch(newURL);
            const json = await response.json();
            setSearchResults(json.data);
            setResultInfo({currentPage: page_number, maxPage: json.total_pages, totalResults: json.total_cards, pageSize: json.page_size});
        }
        catch(error){
            console.error(`Invalid JSON Output: ${error}`);
        }
        //console.log(JSON.stringify(final_data));
    }

    //make an database qyuery to get the desired search results according to the searchParameters var
    async function getCollectionCardlist(page_number: number = 1){
        try{
            const result = await CardDatabase.getUniqueCards(currentCollection, searchParameters, 50, 50 * (page_number - 1));
            setSearchResults(result.result);
            setResultInfo({currentPage: page_number, maxPage: result.info.total_pages, totalResults: result.info.card_count, pageSize: 50});
        }
        catch(error) { console.error(error); }
    }
    
    //called when a new dropdown option is selected in the collection dropdown
    function handleDropdownChange(new_id: number | null){
        setCollection(new_id);
    }

    //called when the buttons at the top of the Search view are pressed
    function toggleSearchMode(){
        setSearchMode(searchMode == SearchMode.Collection ? SearchMode.Index : SearchMode.Collection);
        setSearchParameters('');
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
            { resultInfo.maxPage != 0 && searchResults.length > 0 ? 
                <View style = {{alignItems: "center"}}>
                    <Text style = {styles.text}>{`Displaying ${1 + (resultInfo.currentPage - 1) * resultInfo.pageSize}-${searchResults.length  + (resultInfo.currentPage - 1) * resultInfo.pageSize} of ${resultInfo.totalResults} cards`}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <CustomButton
                            title= "<"
                            onPress={() => function(){ searchMode == SearchMode.Index ? getAPICardlist(resultInfo.currentPage - 1) : getCollectionCardlist(resultInfo.currentPage - 1) }}
                            disabled = { resultInfo.currentPage == 1 }
                        />
                        <Text style = {styles.insideText}>{`Page ${resultInfo.currentPage} of ${resultInfo.maxPage}`}</Text>
                        <CustomButton
                            title= ">"
                            onPress={() => function(){ searchMode == SearchMode.Index ? getAPICardlist(resultInfo.currentPage + 1) : getCollectionCardlist(resultInfo.currentPage + 1) }}
                            disabled = { resultInfo.currentPage == resultInfo.maxPage }
                        />
                    </View>
                </View>
                : <Text style = { styles.text }>Nothing here yet. Search for a card!</Text>
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