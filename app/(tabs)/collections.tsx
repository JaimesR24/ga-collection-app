import { Text, View, Pressable, Button, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { Styles } from '@/scripts/Styles';

export default function Tab(){
    return (
        <View style = {Styles().main} >
            <Text style = {[Styles().text, Styles().title]}>All Collections</Text>
        </View>
    );
}