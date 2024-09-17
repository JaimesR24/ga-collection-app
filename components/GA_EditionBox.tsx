import { View, Text, Button, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardData } from '@/scripts/GA_Definitions';

export default function GA_EditionBox(card: any){
    return (
        <View style = { styles.box }>
            <Text style = {styles.text}>{"Editions."}</Text>
        </View>
    )
}