//use a <Flatlist data = {}/> tag for the whole table
import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { SearchMode } from '@/app/(tabs)/search';

export default function CollectionEntry(c_id: number, name: string, quantity: number){
    return (
        <View style = {styles.entry}>
            <Link href = {{
                    pathname: `../(tabs)/search`,
                    params: {c_id: c_id, mode: SearchMode.Collection}
                    }} asChild>
                <Pressable>
                    <Text style = {styles.insideText}>{`${name} | ${quantity}`}</Text>
                </Pressable>
            </Link>
        </View>
    )
}