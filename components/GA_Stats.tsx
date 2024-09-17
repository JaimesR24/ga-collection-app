import { View, Text, Button, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardData, isMaterialCard } from '@/scripts/GA_Definitions';

export default function GA_StatBox(card: any){
    //untested
    return (
        <View style = { styles.box }>
            <Text style = {styles.text}>{card.name}</Text>
            <Text style = {styles.text}>{isMaterialCard(card) ? card.cost_memory : card.cost_reserve}</Text>
            <Text style = {styles.text}>{card.element}</Text>
        </View>
    )
}