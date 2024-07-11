import axios from 'axios';
const API_URL = 'https://localhost:7129/conversation'

export const getUsersConversation = async (uid) => {
    try {
      const response = await axios.get(`${API_URL}/${uid}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };