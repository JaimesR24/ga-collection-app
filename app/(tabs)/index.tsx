import { Text, View, Pressable, Button} from "react-native";
import React, { useState, useEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';

export default function Index() {
  const [databaseInitialized, setInitState] = useState(false);
  useEffect(() => {
    //create the database if it doesn't exist.
    async function setup(){
      try {
        await CardDatabase.setupDatabase(); //the only database call that is required
        setInitState(true);
      }
      catch(error) {
        console.log(`${error}`);
      }
    }

    if (databaseInitialized) return;
    setup();
  }, []);

  return (
    <View style={styles.main}>
      <Text style={[styles.title, styles.text]}>Welcome to Grand Archive Collection.</Text>
    </View>
  );
}