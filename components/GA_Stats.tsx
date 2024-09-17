import { View, Text, Button, Pressable } from 'react-native';
import { styles } from '@/scripts/Styles';
import { APICardData, isMaterialCard, getFullTypes, getCost } from '@/scripts/GA_Definitions';
import { capitalizeFirstLetter } from '@/scripts/Utils';

export default function GA_StatBox({card}: {card: APICardData}){
    return (
        <View style = { styles.flexibleBox }>
            {card.types && card.subtypes ? <Text style = {styles.text}>{getFullTypes(card)}</Text> : null}
            {card.element ? <Text style = {styles.text}>{`Element: ${capitalizeFirstLetter(card.element)}`}</Text> : null}
            {card.types ? <Text style = {styles.text}>{getCost(card)}</Text> : null}
            {card.level ? <Text style = {styles.text}>{`Level: ${card.level}`}</Text> : null}
            {card.power ? <Text style = {styles.text}>{`Power: ${card.power}`}</Text> : null}
            {card.life ? <Text style = {styles.text}>{`Life: ${card.life}`}</Text> : null}
            {card.durability ? <Text style = {styles.text}>{`Durability: ${card.durability}`}</Text> : null}
            {card.speed ? <Text style = {styles.text}>{`Speed: ${card.speed}`}</Text> : null}
            
            {card.effect_raw ? <Text style = {styles.text}>{`Effect:\n${card.effect_raw}`}</Text> : null}
            {card.flavor ? <Text style = {styles.text}>{`Flavor:\n${card.flavor}`}</Text> : null}
            
        </View>
    )
}

//{card.legality ? <Text style = {styles.text}>{`Effect: ${card.legality}`}</Text> : null}