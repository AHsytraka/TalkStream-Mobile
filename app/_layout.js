import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
        {/* <Stack.Screen name="(tabs)" options={{headerShown:false}}/> */}
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="home/index" options={{headerShown:false}}/>
        <Stack.Screen name="auth/register" options={{headerShown:false}}/>
        <Stack.Screen name="auth/login" options={{headerShown:false}}/>
    </Stack>
  );
}
