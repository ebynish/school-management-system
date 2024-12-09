import { useState, useEffect } from 'react';

const useUserCountry = () => {
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        if (data.status === 'success') {
          setCountry(data.country);
          setCountryCode(data.countryCode);
          setQuery(data.query);
        } else {
          setError('Could not determine user country');
        }
      } catch (err) {
        setError('Error fetching country data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCountry();
  }, []);

  return { country, countryCode, query, loading, error };
};

export default useUserCountry;
