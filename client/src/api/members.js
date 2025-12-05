// api/members.js
import axios from './axios';

export const getMembers = async (token) => {
  const response = await axios.get('/members', {
    headers: { token }
  });
  return response.data;
};

export const createMember = async (token, memberData) => {
  const response = await axios.post('/members', memberData, {
    headers: { token }
  });
  return response.data;
};
