import { Text, View, Pressable, Button, StyleSheet } from "react-native";
import React, { useState } from 'react';
import { styles } from '@/scripts/Styles';

export default function Tab(){
    return (
        <View style = {styles.main} >
            <Text style = {[styles.text, styles.title]}>All Settings</Text>
        </View>
    );
}