import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.weatherapi.com/v1';

const useWeatherAPI = (endpoint: string, apiKey: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}&key=${apiKey}`);
        
        if (!response.data) {
          throw new Error('API response has no data');
        }

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, apiKey]);

  return { data, loading };
};

export default useWeatherAPI;
