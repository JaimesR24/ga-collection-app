import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity } from '@/scripts/GA_Definitions';

export default function GA_EditionEntry({edition, quantity, subHandler, addHandler}: {edition: APICardEdition, quantity: string, subHandler: Function, addHandler: Function}){
    return (
        <View style = {styles.flexibleBox}>
            <ScrollView scrollEnabled = { false }>
                <ScrollView scrollEnabled = { false } horizontal = { true }>
                    {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name}`}</Text> : null } 
                    <Button
                        title="-"
                        onPress={() => subHandler()}
                    />
                    {edition && edition.set ? <Text style = {styles.text}>{`${quantity}`}</Text> : null }
                    <Button
                        title="+"
                        onPress={() => addHandler()}
                    />
                </ScrollView>
                <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
            </ScrollView>
        </View>
    )
}