import { API_BASE_URL } from './config/config';

export const fetchData = (apiUrl, searchText, page, limit, token) =>
  fetch(`${API_BASE_URL}/${apiUrl}?q=${searchText}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    },
  });

export const submitForm = (apiUrl, formData, token) => {
  
  const isMultipart = formData instanceof FormData;
  console.log(isMultipart)
  return fetch(`${API_BASE_URL}/${apiUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, 
        ...(isMultipart ? {} : { 'Content-Type': 'application/json' }), // Avoid manually setting 'Content-Type' for FormData
      },
      body: isMultipart ? formData : JSON.stringify(formData),
    });
  
}
