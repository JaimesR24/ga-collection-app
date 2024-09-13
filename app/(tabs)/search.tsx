import { Text, TextInput, View, FlatList, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { Styles } from '@/scripts/Styles';
import { GA_nameSearchURL, GA_advancedSearchURL } from "@/scripts/GAIndexRequests";
import GACardEntry from '@/components/GACardEntry';

enum SearchMode {Index, Collection};

export default function Tab(results: any){
    const [searchResults, setSearchResults] = useState(results || null);
    const [searchParameters, setSearchParameters] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Index);

    async function getAPICardlist(){
        var URL = '';
        if (typeof searchParameters == 'string') URL = GA_nameSearchURL(searchParameters);
        else URL = GA_advancedSearchURL(searchParameters);

        try {
            console.log(`Attempting to fetch with this url: ${URL}`);
            const response = await fetch(URL);
            const json = await response.json();
            setSearchResults(json.data);
            console.log(JSON.stringify(json.data));
        }
        catch(error){
            console.error(error);
        }
    }

    function getCollectionCardlist(){
        //access the database
    }

    return (
        <View style = {Styles().main}>
            <TextInput 
                style={Styles().textInput} 
                onChangeText={setSearchParameters} 
                value = {searchParameters} 
                defaultValue = "Search..." 
                onSubmitEditing={() => searchMode == SearchMode.Index ? getAPICardlist() : getCollectionCardlist()}
            />
            <FlatList 
                data = {searchResults}
                renderItem ={({item}) => GACardEntry(item.name)}
            />

        </View>
    );
}

//<Text style = {[Styles().text, Styles().title]}>Search</Text>