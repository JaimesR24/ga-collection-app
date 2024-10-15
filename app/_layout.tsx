import { Stack } from "expo-router";
import { screenOptions } from "@/scripts/Styles";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options = { screenOptions.defaultHeader}/>
      <Stack.Screen name="[ga_card]" options = { screenOptions.cardDrawer }/>
    </Stack>
  );
}