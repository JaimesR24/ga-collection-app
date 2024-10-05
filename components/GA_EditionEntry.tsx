import { View, Text } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardEdition, getRarity, isKickstarter } from '@/scripts/GA_Definitions';
import CustomButton from './CustomButton';

//called in GA_EditionBox component, the individual entry item and handlers for manipulating the quantities of a card.
export default function GA_EditionEntry({edition, quantity, subHandler, addHandler, disabled}: {edition: APICardEdition, quantity: string, subHandler: Function, addHandler: Function, disabled: boolean}){
    return (
        <View>
            <View>
                {edition && edition.set ? <Text style = {styles.text}>{`${edition.set.name + (isKickstarter(edition.slug) ? " (KS)" : "")}`}</Text> : null }
                <Text/>
                <Text style = {styles.text}>{`${getRarity(edition.rarity)}`}</Text>
                <Text/>
            </View>
            <View style = { styles.quantityView }>
                <CustomButton
                    title="-"
                    onPress={ subHandler }
                    disabled = { disabled }
                />
                {edition && edition.set ? <Text style = { styles.insideText }>{`Quantity: ${quantity}`}</Text> : null }
                <CustomButton
                    title="+"
                    onPress={ addHandler }
                    disabled = { disabled }
                />
            </View>
        </View>
    )
}