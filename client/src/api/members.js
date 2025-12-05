// api/members.js
import axios from 'axios';

export const getMembers = async (token) => {
  const response = await axios.get('http://localhost:5000/members', {
    headers: { token }
  });
  return response.data;
};
