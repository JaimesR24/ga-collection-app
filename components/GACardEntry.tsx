import { Text } from 'react-native';
import { Styles } from '@/scripts/Styles';

export default function GACardEntry(name: string){
    return (
        <Text style = {Styles().text}>{name}</Text>
    )
}