import axios from 'axios';

const API_URL = 'https://localhost:7129/friend'; // Replace with your actual API URL


export const getAllFriends = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/friends/${userId}`);
    console.log(response.data); // Log the array of friends
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error.response ? error.response.data : error);
    throw error;
  }
};


export const getReceivedFriendRequests = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/received-requests/${userId}`);
    console.log(response.data); // Log the array of received friend requests
    return response.data;
  } catch (error) {
    console.error('Error fetching received friend requests:', error.response ? error.response.data : error);
    throw error;
  }
};

export const sendFriendRequest = async (requesterId, addresseeId) => {
  try {
    const response = await axios.post(`${API_URL}/send`, null, {
      params: { requesterId, addresseeId },
    });
    console.log(response.data); // "Friend request sent successfully."
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error.response.data);
    throw error;
  }
};

export const respondToFriendRequest = async (requesterId, addresseeId, accept) => {
  try {
    const response = await axios.post(`${API_URL}/respond`, null, {
      params: { requesterId, addresseeId, accept },
    });
    console.log(response.data); // "Friend request accepted." or "Friend request declined."
    return response.data;
  } catch (error) {
    console.error('Error responding to friend request:', error.response.data);
    throw error;
  }
};