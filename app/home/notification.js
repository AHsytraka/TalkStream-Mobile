import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function NotificationScreen() {
    return (
        <SafeAreaProvider style={styles.container}>
            <View>
                <Text>Notification Screen</Text>
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

export default withAuthProtection(NotificationScreen)