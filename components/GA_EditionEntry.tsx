import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity } from '@/scripts/GA_Definitions';

export default function GA_EditionEntry(edition: APICardEdition, addHandler: any, subHandler: any){
    return (
        <View style = {styles.flexibleBox}>
            <ScrollView scrollEnabled = { false }>
                <ScrollView scrollEnabled = { false } horizontal = { true }>
                    {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name}`}</Text> : null } 
                    <Button
                        title="-"
                        onPress={() => subHandler()}
                    />
                    <Text style = {styles.text}>{`${0}`}</Text>
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

/*
*/