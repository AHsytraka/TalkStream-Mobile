import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';

function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>
             Profile
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

export default withAuthProtection(ProfileScreen)