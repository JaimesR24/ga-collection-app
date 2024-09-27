import { View, Text } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity, isKickstarter } from '@/scripts/GA_Definitions';
import CustomButton from './CustomButton';

export default function GA_EditionEntry({edition, quantity, subHandler, addHandler, disabled}: {edition: APICardEdition, quantity: string, subHandler: Function, addHandler: Function, disabled: boolean}){
    return (
        <View>
            {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name + (isKickstarter(edition.slug) ? " (KS)" : "")}`}</Text> : null }
            <Text/>
            <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
            <Text/>
            <View style = { styles.quantityView }>
                <CustomButton
                    title="-"
                    onPress={() => function(){ subHandler() }}
                    disabled = { disabled }
                />
                {edition && edition.set ? <Text style = { styles.insideText }>{`Quantity: ${quantity}`}</Text> : null }
                <CustomButton
                    title="+"
                    onPress={() => function(){ addHandler() }}
                    disabled = { disabled }
                />
            </View>
        </View>
    )
}