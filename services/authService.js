import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';
import { router } from 'expo-router';

const API_URL = 'https://localhost:7129'; 

const register = async (username, email,password) => {
    try {
        const response = await axios.post(`${API_URL}/Account/register`, {username, email, password});
        if(response.data.jwt) {
          await AsyncStorage.setItem('token', response.data.jwt);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        }

        return response;

      } catch(error) {
        console.error('Registration failed', error.response.data);
        throw error;
      }
};

const login = async (usernameOrEmail, password) => {
  try {
      const response = await axios.post(`${API_URL}/Account/login`, { usernameOrEmail, password });
      if (response.data.jwt) {
          await AsyncStorage.setItem('token', response.data.jwt);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      }

      return response;
  } catch (error) {
      // Check if error.response is defined
      if (error.response) {
          console.error('Login failed', error.response.data);
      } else {
          // Handle cases where error.response is undefined
          console.error('Login failed', error.message);
      }
      throw error;
  }
};

const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    router.replace('/auth/Login');
}

const getToken = async() => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    return token;
  } catch(error) {
    console.error('error retrieving token', error);
    return null;
  }
}

const fetchUser = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data', error);
    return null;
  }
};


export default {
  register,
  login,
  logout,
  getToken,
  fetchUser
};