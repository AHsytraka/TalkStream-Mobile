import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();


export default function App() {
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
      setReady(true);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
        <Link href="/auth/login">
            Se connecter
        </Link>
        <Link href="/auth/register">
            S'inscrire
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

