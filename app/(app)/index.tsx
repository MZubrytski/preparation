import { AuthContext } from "@/context/AuthContext";
import { Link } from "expo-router";
import { useContext } from "react";
import { Text, View, Button, StyleSheet } from "react-native";

export default function Index() {
  const { hasRole } = useContext(AuthContext)
  
  return (
    <View style={styles.container}>
      <Text>
        {hasRole('Manager') ? 'You are Manager' : ''}
        {hasRole('IC') ? 'You are IC' : ''}
      </Text>

      <Button title={'Profile'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
