import { View, Text, Button, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { getElementColor } from '@/scripts/GA_Definitions';

//the entries displayed within search results that lead to the [ga_card] view when pressed. the only necessary information to function is the card name and the collection.
export default function GA_CardEntry(card: any, c_id: number | null){
    return (
        <Link href = {{
                    pathname: `../ga_view/[ga_card]`,
                    params: {ga_card: card.name, initCollection: c_id}
                    }} asChild>
            <Pressable>
                <View style = {[styles.entry, {backgroundColor: getElementColor(card.element)}]}>
                    <Text style = {styles.insideText}>{card.name}</Text>
                </View>
            </Pressable>
        </Link>
    )
}