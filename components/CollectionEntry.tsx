//use a <Flatlist data = {}/> tag for the whole table
import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { SearchMode } from '@/app/(tabs)/search';

export default function CollectionEntry(c_id: number, name: string, quantity: number){
    return (
        <View style = {styles.box}>
            <Link href = {{
                    pathname: `../(tabs)/search`,
                    params: {c_id: c_id, mode: SearchMode.Collection}
                    }} asChild>
                <Pressable>
                    <ScrollView horizontal = {true} scrollEnabled = {false}>
                        <Text style = {styles.text}>{name}</Text>
                        <Text style = {styles.text}> | </Text>
                        <Text style = {styles.text}>{quantity}</Text>
                    </ScrollView>
                </Pressable>
            </Link>
        </View>
    )
}