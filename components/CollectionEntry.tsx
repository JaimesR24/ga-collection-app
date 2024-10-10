import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { styles } from '@/scripts/Styles';
import { Link } from 'expo-router';
import { SearchMode } from '@/app/(tabs)/search';
import CustomButton from './CustomButton';

const addIcon = require("@/assets/images/add.png");
const deleteIcon = require("@/assets/images/delete.png");
const editIcon = require("@/assets/images/edit.png");

//component used for individual collections in the collections view
export default function CollectionEntry(c_id: number, name: string, quantity: number, editHandler: Function, deleteHandler: Function){
    
    return (
        <View style = {[styles.entry, {flexDirection: "row"}]}>
            <Link href = {{
                    pathname: `../(tabs)/search`,
                    params: {c_id: c_id, mode: SearchMode.Collection}
                    }} asChild>
                <Pressable>
                    <View>
                        <Text style = {styles.insideText}>{`${name}`}</Text>
                        <Text style = {styles.insideText}>{`${quantity} cards`}</Text>
                    </View>
                </Pressable>
            </Link>
            <View style = {[styles.buttonRowView, {flexDirection: "row"}]}>
                <CustomButton
                    title = { c_id ? "EDIT" : "ADD"}
                    onPress = { editHandler }
                    disabled = { false }
                    imageSrc = { c_id ? editIcon : addIcon }
                    buttonStyle = { [styles.collectionsButton, {marginRight: 5}] }
                />
                { c_id ? 
                <CustomButton
                    title = "DELETE"
                    onPress = { deleteHandler }
                    disabled = { false }
                    imageSrc = { deleteIcon }
                    buttonStyle = { [styles.collectionsButton, {marginLeft: 5}] }
                /> : null }
            </View>
        </View>
    )
}