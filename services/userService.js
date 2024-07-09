import axios from "axios";

const API_URL = "https://localhost:7129";

export const sendFriendRequest = async (userId, friendId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/sendFriendRequest/${friendId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};