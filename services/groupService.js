import axios from 'axios';
const API_URL = 'https://localhost:7129/Group';

export const createGroup = async (name, creatorId, memberIds) => {
  try {
    const response = await axios.post(`${API_URL}/create`, {
      name,
      creatorId,
      memberIds,
    });
    return response.data; // Ensure this contains the groupId property
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroupMessages = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
};

export const sendMessage = async (groupId, message) => {
  try {
    const response = await axios.post(`${API_URL}/${groupId}/messages`, message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
