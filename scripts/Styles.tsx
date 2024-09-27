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
        display: "flex",
        margin: 5,
        padding: 10,
        alignContent: "center",
    },
    cardImage:{
        width: 250,
        height: 350,
        alignSelf: "center",
        margin: 10,
        //this is exact margin within the parent view, flexibleBox. need to check on different resolutions
    },
    dropdown:{
        margin: 16,
        height: 50,
        width: 150,
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
    },
    entry:{
        borderWidth: 1,
        borderColor: "white",
        height: 40,
        margin: 10,
        padding: 5,
        alignContent: "center",
        justifyContent: "center",
    },
    button:{
        borderColor: "white",
        borderWidth: 0.5,
        minWidth: 50,
        minHeight: 30,
        margin: 10,
        padding: 5,
        alignContent: "center",
        justifyContent: "center",
    },
    insideText:{
        color: "white",
        textAlign: "center",
    },
    quantityView:{
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});

export const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.text,
}