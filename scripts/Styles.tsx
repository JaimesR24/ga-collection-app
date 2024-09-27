import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        borderColor: "white",
        backgroundColor: "grey",
        height: 45,
        width: 250,
        margin: 14,
        color: "white",
        fontSize: 24,
        padding: 10,
    },
    box:{
        borderWidth: 1,
        borderColor: "white",
        height: 40,
        width: 400,
        margin: 5,
        padding: 10,
        alignContent: "center",
    },
    flexibleBox:{
        borderWidth: 1,
        borderColor: "white",
        width: 400,
        margin: 5,
        padding: 10,
        alignContent: "center",
    },
    cardImage:{
        width: 250,
        height: 350,
        alignItems: "center",
        //this is exact margin within the parent view, flexibleBox. need to check on different resolutions
        marginLeft: 75,
    },
    dropdown:{
        margin: 16,
        height: 50,
        width: 150,
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
    },
    button:{
        borderColor: "white",
        borderWidth: 0.5,
        minWidth: 20,
        maxWidth: 50,
        margin: 10,
    },
});

export const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.text,
}