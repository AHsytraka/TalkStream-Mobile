import axios from 'axios';

const API_URL = 'https://localhost:7129/publications';

export const addComment = async (postId, commentData) => {
    const response = await axios.post(`${API_URL}/${postId}/comments`, commentData);
    return response.data;
};

export const addReaction = async (postId, reactionData) => {
    const response = await axios.post(`${API_URL}/${postId}/reactions`, reactionData);
    return response.data;
};