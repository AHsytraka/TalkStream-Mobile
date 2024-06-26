import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// This HOC checks for token presence and redirects to login if not found
export const withAuthProtection = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // No token found, redirect to login
          router.push('/auth/login');
        } else {
          setIsLoading(false);
        }
      };

      checkToken();
    }, [router]);

    if (isLoading) {
      return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='small' />
      </View>;
    }

    return <WrappedComponent {...props} />;
  };
};