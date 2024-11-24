import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export default function AppLayout() {
  const { isSignedIn } = useContext(AuthContext)
  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isSignedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(auth)/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}