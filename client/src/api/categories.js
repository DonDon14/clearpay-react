// api/members.js
import axios from './axios';

// Fetch All
export const getCategories = async (token) => {
  const response = await axios.get('/categories', {
    headers: { token }
  });
  return response.data;
};

export const createCategory = async (token, data) => {
  const response = await axios.post('/categories', data, {
    headers: { token }
  });
  return response.data;
}

export const editCategory = async (token, id, data) => {
  const response = await axios.put(`/categories/${id}`, data, {
    headers: { token }
  });
  return response.data;
}

export const deleteCategory = async (token, id) => {
  const response = await axios.delete(`/categories/${id}`, data, {
    headers: { token }
  });
  return response.data;
}

