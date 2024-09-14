import { Text, View, Button} from "react-native";
import React, { useState } from 'react';
import { Styles } from '@/scripts/Styles';

export default function CardView(cardEntry: {}) {
    const [currentCard, setCard] = useState(cardEntry);

    return (
        <View style={Styles().main}>
            <Text style={[Styles().title, Styles().text]}>Welcome to Grand Archive Collection.</Text>
        </View>
    );
}