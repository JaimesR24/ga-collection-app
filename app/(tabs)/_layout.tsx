import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Styles } from "@/scripts/Styles";

export default function TabLayout(){
    return(
        <Tabs screenOptions={tabBarOptions}>
            <Tabs.Screen
                name = "index"
                options = {{
                    title: "Home",
                    //tabBarIcon: () => <Text style = {styles.temp}>Collections</Text>
                }}
            />
            <Tabs.Screen
                name = "collections"
                options = {{
                    title: "Collections",
                    //tabBarIcon: () => <Text style = {styles.temp}>Collections</Text>
                }}
            />
            <Tabs.Screen
                name = "search"
                options = {{
                    title: "Search",
                    //tabBarIcon: () => <Text style = {styles.temp}>Search</Text>
                }}
            />
            <Tabs.Screen
                name = "settings"
                options = {{
                    title: "Settings",
                    //tabBarIcon: () => <Text style = {styles.temp}>Settings</Text>
                }}
            />
        </Tabs>
    );
}

const tabBarOptions = {
    tabBarStyle: Styles().tabBar,
    tabBarActiveBackgroundColor: "white",
    tabBarActiveTintColor: "black",
    headerStyle: Styles().header,
    headerTintColor: "white"
};