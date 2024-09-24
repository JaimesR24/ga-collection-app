import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity, isKickstarter } from '@/scripts/GA_Definitions';

export default function GA_EditionEntry({edition, quantity, subHandler, addHandler, disabled}: {edition: APICardEdition, quantity: string, subHandler: Function, addHandler: Function, disabled: boolean}){
    return (
        <View style = {styles.flexibleBox}>
            <ScrollView scrollEnabled = { false }>
                <ScrollView scrollEnabled = { false } horizontal = { true }>
                    {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name + (isKickstarter(edition.slug) ? " (KS)" : "")}`}</Text> : null } 
                    <Button
                        title="-"
                        onPress={() => subHandler()}
                        disabled = { disabled }
                    />
                    {edition && edition.set ? <Text style = {styles.text}>{`${quantity}`}</Text> : null }
                    <Button
                        title="+"
                        onPress={() => addHandler()}
                        disabled = { disabled }
                    />
                </ScrollView>
                <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
            </ScrollView>
        </View>
    )
}