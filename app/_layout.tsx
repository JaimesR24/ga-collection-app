import { Stack } from "expo-router";
import { Styles } from "@/scripts/Styles";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}