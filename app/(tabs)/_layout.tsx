import { Tabs } from 'expo-router';
import { styles } from "@/scripts/Styles";

export default function TabLayout(){
    return(
        <Tabs screenOptions={tabBarOptions}>
            <Tabs.Screen
                name = "index"
                options = {{
                    title: "Home",
                    headerTitleAlign: "center",
                    //tabBarIcon: () => <Text style = {styles.temp}>Collections</Text>
                }}
            />
            <Tabs.Screen
                name = "collections"
                options = {{
                    title: "Collections",
                    headerTitleAlign: "center",
                    //tabBarIcon: () => <Text style = {styles.temp}>Collections</Text>
                }}
            />
            <Tabs.Screen
                name = "search"
                options = {{
                    title: "Search",
                    headerTitleAlign: "center",
                    //tabBarIcon: () => <Text style = {styles.temp}>Search</Text>
                }}
            />
            <Tabs.Screen
                name = "settings"
                options = {{
                    title: "Settings",
                    headerTitleAlign: "center",
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