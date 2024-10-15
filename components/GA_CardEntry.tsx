import { View, Text, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { getElementColor } from '@/scripts/GA_Definitions';

//the entries displayed within search results that lead to the [ga_card] view when pressed. the only necessary information to function is the card name and the collection.
export default function GA_CardEntry(card: any, c_id: number | null){
    return (
        <Link push href = {{
                    pathname: `/[ga_card]`,
                    params: {ga_card: card.name, initCollection: c_id}
                    }} asChild>
            <Pressable>
                <View style = {[styles.entry, {backgroundColor: getElementColor(card.element), flexDirection: "row", paddingTop: 8}]}>
                    <Text style = {styles.insideText}>{card.name}</Text>
                    { card.quantity ? 
                        <Text style = {[styles.text, {position: "absolute", right: 5, top: 8}]}>x{card.quantity}</Text>
                    : null }
                </View>
            </Pressable>
        </Link>
    )
}
//{ card.quantity ? <View style = {{justifyContent: "flex-end"}}><Text style = {styles.text}>x{card.quantity}</Text></View> : null }
//{ card.quantity ? <Text style = {[styles.text, {alignContent: "flex-end"}]}>x{card.quantity}</Text> : null }

/*
{ card.quantity ? <View style = {{justifyContent: "flex-end"}}><Text style = {styles.text}>x{card.quantity}</Text></View> : null }
{ card.quantity ? <Text style = {[styles.text, {alignContent: "flex-end"}]}>x{card.quantity}</Text> : null }



                    <View>
                        <Text style = {[styles.insideText, {justifyContent: "center"}]}>{card.name}</Text>
                    </View>
                    { card.quantity ? 
                        <View style = {{justifyContent: "flex-end"}}>
                            <Text style = {[styles.text]}>x{card.quantity}</Text>
                        </View>
                    : null }
*/