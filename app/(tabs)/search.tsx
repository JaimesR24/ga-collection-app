import { Text, TextInput, View, FlatList, } from "react-native";
import React, { useLayoutEffect, useState } from 'react';
import { styles } from '@/scripts/Styles';
import * as GA_API from "@/scripts/GA_IndexRequests";
import GA_CardEntry from '@/components/GA_CardEntry';
import * as CardDatabase from '@/scripts/Database';
import { useLocalSearchParams } from "expo-router";
import CollectionDropdown from "@/components/CollectionDropdown";
import CustomButton from "@/components/CustomButton";
import { useIsFocused } from "@react-navigation/native";

export enum SearchMode {Index, Collection};

export default function Tab(){
    const local = useLocalSearchParams();
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
    const isFocused = useIsFocused();

    //pass along the props via the local var into the states themselves
    useLayoutEffect(() => {
        //initialize the search results. if collection, get the total. if index, return nothing.
        if (searchMode == SearchMode.Collection) getCollectionCardlist(); 
        else setSearchResults([]);

        //rerender whenever the search mode or collection selection is changed to get the correct search results
    }, [searchMode, currentCollection]);

    useLayoutEffect(() => {
        var c_id = Number(local.c_id as string) || null;
        var mode = Number(local.mode as string) as SearchMode || SearchMode.Index;
        if (c_id != currentCollection){
            console.log(`Id... ${JSON.stringify(local.c_id)}`);
            console.log(`Search Mode... ${JSON.stringify(local.mode)}`);
            setCollection(c_id);
            setSearchMode(mode);
        }
        else if (searchMode == SearchMode.Collection) verifyCollectionChanges();
    }, [isFocused]);

    async function verifyCollectionChanges(){
        try{
            const numResult = await CardDatabase.getCollectionCount() as any;
            if (numResult.sum != searchResults.length) getCollectionCardlist();
        }
        catch (error) { console.error(error); }
    }

    //make an API request from the Grand Archive Index to get the desired search results according to the searchParameters var
    async function getAPICardlist(page_number: number = 1){
        try {
            //typeof searchParameters == 'string' ? await GA_API.get_GA_NameSearch(searchParameters, page_number) : await GA_API.get_GA_AdvancedSearch();
            const result = await GA_API.get_GA_NameSearch(searchParameters, page_number);
            setSearchResults(result.data);
            setResultInfo({currentPage: page_number, maxPage: result.total_pages, totalResults: result.total_cards, pageSize: result.page_size});
            
        }
        catch(error){ 
            setSearchResults([]);
            console.error(error);
        }
        //console.log(JSON.stringify(final_data));
    }

    //make a database query to get the desired search results according to the searchParameters var
    async function getCollectionCardlist(page_number: number = 1){
        try{
            const result = await CardDatabase.getUniqueCards(currentCollection, searchParameters, 50, 50 * (page_number - 1));
            setSearchResults(result.result);
            setResultInfo({currentPage: page_number, maxPage: result.info.total_pages, totalResults: result.info.card_count, pageSize: 50});
        }
        catch(error) { 
            setSearchResults([]);
            console.error(error);
        }
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

    //consider adding a onRefresh functionality to empty search results while waiting for a new api/database request and show a loading symbol
    return (
        <View style = {styles.main}>
            <View style = {{maxHeight: 50, flexDirection: "row"}}>
                <CustomButton
                    title= "Collections"
                    onPress={ toggleSearchMode }
                    disabled = { searchMode == SearchMode.Collection }
                />
                <CustomButton
                    title= "Index"
                    onPress={ toggleSearchMode }
                    disabled = { searchMode == SearchMode.Index }
                />
            </View>
            { searchMode == SearchMode.Collection ? <CollectionDropdown collection_id = { currentCollection } changeHandler= { handleDropdownChange }/> : null }
            <TextInput 
                style={styles.textInput} 
                onChangeText={setSearchParameters} 
                value = {searchParameters} 
                defaultValue = "Search..." 
                onSubmitEditing={() => searchMode == SearchMode.Index ? getAPICardlist() : getCollectionCardlist()}
            />
            { searchResults.length > 0 ? 
                <View style = {{alignItems: "center"}}>
                    <Text style = {styles.text}>{`Displaying ${1 + (resultInfo.currentPage - 1) * resultInfo.pageSize}-${searchResults.length  + (resultInfo.currentPage - 1) * resultInfo.pageSize} of ${resultInfo.totalResults} cards`}</Text>
                    <View style = {{flexDirection: "row"}}>
                        <CustomButton
                            title= "<"
                            onPress={() => searchMode == SearchMode.Index ? getAPICardlist(resultInfo.currentPage - 1) : getCollectionCardlist(resultInfo.currentPage - 1) }
                            disabled = { resultInfo.currentPage == 1 }
                        />
                        <Text style = {styles.insideText}>{`Page ${resultInfo.currentPage} of ${resultInfo.maxPage}`}</Text>
                        <CustomButton
                            title= ">"
                            onPress={() => searchMode == SearchMode.Index ? getAPICardlist(resultInfo.currentPage + 1) : getCollectionCardlist(resultInfo.currentPage + 1) }
                            disabled = { resultInfo.currentPage == resultInfo.maxPage }
                        />
                    </View>
                </View>
                : <Text style = { styles.text }>Nothing here yet. {searchMode == SearchMode.Index ? "\nSearch for a card!" : "\nAdd cards to your collection using the Index mode!"}</Text>
            }
            <FlatList 
                data = {searchResults}
                extraData = {currentCollection}
                renderItem ={({item}) => GA_CardEntry(item, searchMode == SearchMode.Collection ? currentCollection : null)}
            />
        </View>
    );
}