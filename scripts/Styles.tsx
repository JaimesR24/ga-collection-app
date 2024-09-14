import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    main: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black"
    },
    header:{
        backgroundColor: "black",
    },
    tabBar:{
        backgroundColor: "black",
    },
    text:{
        color: "white",
    },
    title:{
        fontSize: 32
    },
    textInput:{
        borderWidth: 1,
        borderBlockColor: "white",
        backgroundColor: "grey",
        height: 45,
        margin: 14,
        color: "white",
        fontSize: 24,
        padding: 10,
    },
    box:{
        borderWidth: 1,
        borderBlockColor: "white",
        height: 40,
        width: 300,
        margin: 5,
        padding: 10,
    }
});

export function Styles(){
    return styles;
}