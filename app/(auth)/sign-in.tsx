import { AuthContext } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  const { signIn, isSignedIn } = useContext(AuthContext)
  console.log('isSignedIn', isSignedIn)
  if (isSignedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(app)" />;
  }

    return (
        <View>
          <Text>
            Hello! Here will be login
          </Text>
          <TouchableOpacity style={{width: 100, height: 50, backgroundColor: 'red'}} onPress={() => {
            signIn()
            // router.push('/(app)')
            }}>
            <Text>Log In</Text>
          </TouchableOpacity>
        </View>

    );
}
  