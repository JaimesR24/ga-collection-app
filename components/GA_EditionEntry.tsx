import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity, isKickstarter } from '@/scripts/GA_Definitions';
import CustomButton from './CustomButton';

export default function GA_EditionEntry({edition, quantity, subHandler, addHandler, disabled}: {edition: APICardEdition, quantity: string, subHandler: Function, addHandler: Function, disabled: boolean}){
    return (
        <ScrollView scrollEnabled = { false }>
            {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name + (isKickstarter(edition.slug) ? " (KS)" : "")}`}</Text> : null }
            <Text></Text>
            <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
            <ScrollView scrollEnabled = { false } horizontal = { true }>
                <CustomButton
                    title="-"
                    onPress={() => function(){ subHandler() }}
                    disabled = { disabled }
                />
                {edition && edition.set ? <Text style = {styles.text}>{`Quantity: ${quantity}`}</Text> : null }
                <CustomButton
                    title="+"
                    onPress={() => function(){ addHandler() }}
                    disabled = { disabled }
                />
            </ScrollView>
        </ScrollView>
    )
}