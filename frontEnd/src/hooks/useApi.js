// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access the Redux state

const useApi = (apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const token = useSelector((state) => state.auth.token); // Adjust the path as necessary


  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      // console.log(...params, token, "this", apiCall)
      const response = await apiCall(...params, token);
      
      // Check if the response is okay before parsing JSON
      if (!response?.ok) {
        // console.log(response)
        const result = await response.json();
        throw new Error(result?.message || 'Something went wrong');
      }

      const result = await response.json();
      setData(result);
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, token]);

  return { data, loading, error, execute };
};

export default useApi;
