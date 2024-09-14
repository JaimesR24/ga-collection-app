import { View, Text, Button, Pressable } from 'react-native';
import { Styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { getElementColor } from '@/scripts/GATranslations';

export default function GACardEntry(name: string, element: string){
    //untested
    return (
        <View style = {[Styles().box, {backgroundColor: getElementColor(element)}]}>
            <Link href ="../ga_cardview" asChild>
                <Pressable>
                    <Text style = {Styles().text}>{name}</Text>
                </Pressable>
            </Link>
        </View>
    )
}