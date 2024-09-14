import { Text, TextInput, View, FlatList, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { Styles } from '@/scripts/Styles';
import { GA_nameSearchURL, GA_advancedSearchURL, GA_cardImageURL } from "@/scripts/GAIndexRequests";
import GACardEntry from '@/components/GACardEntry';

enum SearchMode {Index, Collection};

export default function Tab(results: any[]){
    const [searchResults, setSearchResults] = useState(results || {});
    const [searchParameters, setSearchParameters] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Index);

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
                console.log(`Attempting to fetch with this url: ${newURL}`);
                const response = await fetch(newURL);
                json = await response.json();
                final_data = page_number == 1 ? json.data : [...final_data || [], ...json.data];
                page_number++;
            }
            catch(error){
                console.error(error);
                break;
            }
        }
        setSearchResults(final_data);
        //console.log(JSON.stringify(final_data));
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
                renderItem ={({item}) => GACardEntry(item.name, item.element)}
            />

        </View>
    );
}

//<Text style = {[Styles().text, Styles().title]}>Search</Text>