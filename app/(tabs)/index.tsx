import { Text, View, Pressable, Button} from "react-native";
import React, { useState, useEffect } from 'react';
import { styles } from '@/scripts/Styles';
import * as CardDatabase from '@/scripts/Database';

export default function Index() {
  const [databaseInitialized, setInitState] = useState(false);
  useEffect(() => {

    async function setup(){
      try {
        await CardDatabase.clearDatabase();
        await CardDatabase.setupDatabase();
        await CardDatabase.addCollection("Dummy Collection 1");
        await CardDatabase.addCollection("Dummy Collection 2");
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