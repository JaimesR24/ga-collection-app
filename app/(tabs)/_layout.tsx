import { Tabs } from 'expo-router';
import { styles } from "@/scripts/Styles";

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
    tabBarStyle: styles.tabBar,
    tabBarActiveBackgroundColor: "white",
    tabBarActiveTintColor: "black",
    headerStyle: styles.header,
    headerTintColor: "white"
};