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
        borderBlockColor: "white",
        height: 40,
        width: 300,
        margin: 5,
        padding: 10,
        alignContent: "center",
    },
    flexibleBox:{
        borderWidth: 1,
        borderBlockColor: "white",
        width: 350,
        margin: 5,
        padding: 10,
        alignContent: "center",
    },
    cardImage:{
        width: 250,
        height: 350,
        alignItems: "center",
        //this is exact margin within the parent view, flexibleBox. need to check on different resolutions
        marginLeft: 50,
    },
    dropdown:{
        margin: 16,
        height: 50,
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
    },
    button:{
        width: 20,
        borderColor: "white",
    },
});

export const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.text,
}