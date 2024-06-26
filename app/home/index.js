import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import authService from '../../services/authService';
import { withAuthProtection } from '../../components/withAuthProtection';

function HomeScreen() {
    useEffect(() => {
        const test = authService.getToken()
        console.log(test)
    },[])
    console.log(authService.getToken);
    return (
        <View style={styles.container}>
            <Text>
                WELCOME HOME
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

export default withAuthProtection(HomeScreen)