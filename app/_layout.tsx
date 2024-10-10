import { Stack } from "expo-router";
import { headerOptions } from "@/scripts/Styles";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{title: "", headerShown: false}}/>
      <Stack.Screen name="[ga_card]" options = { headerOptions }/>
    </Stack>
  );
}