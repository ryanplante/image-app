import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = 'd7e88c2243f84a3eb41183055231408';

const useWeatherAPI = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`${API_BASE_URL}${endpoint}&key=${API_KEY}`)
        const response = await axios.get(`${API_BASE_URL}${endpoint}&key=${API_KEY}`);
        
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
  }, [endpoint, API_KEY]);

  return { data, loading };
};

export default useWeatherAPI;
