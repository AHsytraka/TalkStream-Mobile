import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://localhost:7129'; 

const register = async (username, email,password) => {
    try {
        const response = await axios.post(`${API_URL}/Account/register`, {username, email, password});
        if(response.data.jwt) {
          await AsyncStorage.setItem('token', response.data.jwt);
        }

        return response;

      } catch(error) {
        console.error('Registration failed', error.response.data);
        throw error;
      }
};

const login = async (usernameOrEmail,password) => {
    try {
        const response = await axios.post(`${API_URL}/Account/login`, {usernameOrEmail, password});
        if(response.data.jwt) {
          await AsyncStorage.setItem('token', response.data.jwt);
        }

        return response;
      } catch(error) {
        console.error('Registration failed', error.response.data);
        throw error;
      }
};

const logout = async () => {
    await AsyncStorage.removeItem('token');
}

const getToken = async() => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch(error) {
    console.error('error retrieving token', error);
    return null;
  }
}


export default {
  register,
  login,
  logout,
  getToken
};