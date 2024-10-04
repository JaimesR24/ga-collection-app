import { Text, View, Button, Image, ScrollView,} from "react-native";
import React, { useState, useLayoutEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as GA_API from "@/scripts/GA_IndexRequests";
import { APICardData } from "@/scripts/GA_Definitions";
import { useLocalSearchParams, useNavigation } from "expo-router";
import GA_StatBox from "@/components/GA_Stats";
import GA_EditionBox from "@/components/GA_EditionBox";
import Modal from "react-native-modal";

//import genericCardBack from "@/assets/images/GA-cardback.png";

export default function CardView() {
    //passed props from the GA_CardEntry press
    const local = useLocalSearchParams();
    //the current full card information object from the API request
    const [currentCard, setCard] = useState({} as APICardData);
    //the card image link shown here. initialized to a blank card back.
    const [currentImageSrc, setImageSrc] = useState("@/assets/images/GA-cardback.png");//doesn't seem to work
    //necessary to change the name of the tab
    const navigation = useNavigation();
    //visible state for the modal component used as a pop up

    //get the information from the Grand Archive Index tto display here. does not matter whether the initial call came from Collection or Index search.
    async function prepareCardView(name: string){ 
        try {
            //console.log(`First Stringify: ${JSON.stringify(currentCard)}`);
            const result = await GA_API.get_GA_NameSearch(name);
            setCard(result.data[0] as APICardData);
            //console.log(`Edition Stringify: ${JSON.stringify(temp.result_editions[0])}`);
            //console.log(`Attempting to set the image source var to ${GA_cardImageURL(json.data[0].result_editions[0].slug)}`);
            setImageSrc(GA_API.GA_cardImageURL(result.data[0].result_editions[0].slug));
        }
        catch(error) { console.error(error); }
    }
    
    useLayoutEffect(() => {
        if (local.ga_card){
            //change the name of the tab to the card itself
            navigation.setOptions({title: local.ga_card as string});
            prepareCardView(local.ga_card as string);
        }
    }, [navigation, local.ga_card]);

    //NOT TESTED. the handler for pressing the edition entry button to change the image of the card shown
    function handleChangeImage(editionSlug: string){
        setImageSrc(GA_API.GA_cardImageURL(editionSlug));
    }
    
    return (
        <View style={styles.main}>
            <ScrollView>
                <Image
                    source = {{ uri: currentImageSrc }}
                    style = {styles.cardImage}
                />
                { currentCard ? <GA_EditionBox card = { currentCard } collection = { Number(local.initCollection as string) } imageHandler= { handleChangeImage }/> : null}
                { currentCard ? <GA_StatBox card = { currentCard }/> : null}
            </ScrollView>
        </View>
    );
}