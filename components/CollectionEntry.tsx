import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { SearchMode } from '@/app/(tabs)/search';

//component used for individual collections in the collections view
export default function CollectionEntry(c_id: number, name: string, quantity: number){
    return (
        <View style = {[styles.entry, {flexDirection: "row"}]}>
            <Link href = {{
                    pathname: `../(tabs)/search`,
                    params: {c_id: c_id, mode: SearchMode.Collection}
                    }} asChild>
                <Pressable>
                    <Text style = {styles.insideText}>{`${name} | ${quantity}`}</Text>
                </Pressable>
            </Link>
            <Text style = { styles.insideText }> | Button</Text>
        </View>
    )
}
//add a button that can be used to delete a collection, or have a specific "Delete mode" where collections can be selected and deleted