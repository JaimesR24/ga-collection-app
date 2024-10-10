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
        fontSize: 32,
        textAlign: "center",
    },
    textInput:{
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "grey",
        height: 45,
        width: 350,
        margin: 14,
        color: "white",
        fontSize: 20,
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
        height: 30,
        width: 200,
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
        backgroundColor: "black",
    },
    dropdownContainer:{
        backgroundColor: "black",

    },
    entry:{
        borderWidth: 1,
        borderColor: "white",
        minHeight: 40,
        maxHeight: 60,
        width: 350,
        //width: "90%",
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
    modalView:{
        alignItems: "center",
        backgroundColor: "black",
        borderColor: "white",
        borderWidth: 0.5,
        margin: 30,
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalBackdrop:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        height: '100%',
        width: '100%',
    },
    modalHeader:{
        color: "white",
        fontSize: 32,
    },
    modalBody:{
        color: "white",
        fontSize: 16,
    },
    collectionsButton:{
        borderColor: "white",
        borderWidth: 0.5,
        width: 30,
        height: 30,
        padding: 5,
        justifyContent: "center",
        alignContent: "center",
    },
    iconImage:{
        width: 20,
        height: 20,
        alignSelf: "center",
    },
    buttonRowView:{
        marginLeft: "auto",
        alignContent: "center",
        justifyContent: "flex-end",
    },
    modalInput:{
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "grey",
        height: 45,
        width: 250,
        color: "white",
        fontSize: 20,
        padding: 10,
    },
});

export const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.text,
}