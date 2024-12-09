import { API_BASE_URL } from './config/config';

export const fetchData = (apiUrl, searchText, page, limit, token) =>
  fetch(`${API_BASE_URL}/${apiUrl}?q=${searchText}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    },
  });

export const submitForm = (apiUrl, formData, token) => 
  fetch(`${API_BASE_URL}/${apiUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
  });  
  
