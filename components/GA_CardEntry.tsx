import { View, Text, Button, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { getElementColor } from '@/scripts/GA_Definitions';

export default function GA_CardEntry(card: any, c_id: number | null){
    return (
        <View style = {[styles.box, {backgroundColor: getElementColor(card.element)}]}>
            <Link href = {{
                    pathname: `../ga_view/[ga_card]`,
                    params: {ga_card: card.name, initCollection: c_id}
                    }} asChild>
                <Pressable>
                    <Text style = {styles.text}>{card.name}</Text>
                </Pressable>
            </Link>
        </View>
    )
}