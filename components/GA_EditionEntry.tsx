import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity } from '@/scripts/GA_Definitions';
import { useState } from 'react';

//export default function GA_EditionEntry(edition: APICardEdition, addHandler: any, subHandler: any){
export default function GA_EditionEntry({edition}: {edition: APICardEdition}){
    const [quantity, setQuantity] = useState(0);

    return (
        <View style = {styles.flexibleBox}>
            <ScrollView scrollEnabled = { false }>
                <ScrollView scrollEnabled = { false } horizontal = { true }>
                    {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name}`}</Text> : null } 
                    <Button
                        title="-"
                        onPress={() => setQuantity(quantity - 1)}
                    />
                    {edition && edition.set ? <Text style = {styles.text}>{`${quantity}`}</Text> : null }
                    <Button
                        title="+"
                        onPress={() => setQuantity(quantity + 1)}
                    />
                </ScrollView>
                <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
            </ScrollView>
        </View>
    )
}

/*
*/