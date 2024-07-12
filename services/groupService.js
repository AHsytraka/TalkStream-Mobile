import axios from 'axios';
import { connection } from './signalRGroup';

const API_URL = 'https://localhost:7129';

export const createGroup = async (group) => {
    const response = await axios.post(`${API_URL}/Group`, group);
    return response.data;
};

export const addUserToGroup = async (groupId, userGroup) => {
    await axios.post(`${API_URL}/Group/${groupId}/addUser`, userGroup);
};

export const sendMessage = async (groupId, message) => {
    await axios.post(`${API_URL}/Group/${groupId}/messages`, message);
    connection.invoke("SendMessage", groupId, message.senderId, message.content);
};
