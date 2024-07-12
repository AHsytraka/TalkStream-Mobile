import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'react-native';

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
        <Link href="/auth/login" style={styles.text1}>
            Se connecter
        </Link>
        <Link href="/auth/register" style={styles.text2}>
            S'inscrire
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({

    text1: {
      fontSize:20,
      color: 'blue',
    },
    text2: {
      fontSize:20,
      color: 'black',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

