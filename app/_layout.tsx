import { AuthContextProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

const wrapper = <>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)/sign-in" />
</>

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen redirect={true} name="(auth)/sign-in" />
      </Stack>
    </AuthContextProvider>
  );
}
