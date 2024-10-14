import React, { useState, useEffect } from 'react';
import './MetricsSection.css';

interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: number;
}

const FearGreedIndex: React.FC = () => {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/bitcoin-fear-greed');
        const data = await response.json();

        // Log the raw timestamp data from the API
        console.log('Raw API response:', data);
        console.log('Raw timestamp from API:', data.timestamp);

        setFearGreedData(data);
      } catch (error) {
        console.error('Error fetching Fear and Greed Index:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="metric-card">
      <h3>Bitcoin Fear and Greed Index</h3>
      {fearGreedData ? (
        <div>
          <p>Index Value: {fearGreedData.value}</p>
          <p>Classification: {fearGreedData.value_classification}</p>
          <p>
            Last Updated:{' '}
            {new Date(fearGreedData.timestamp * 1000).toLocaleString('en-US', {
              timeZone: 'UTC',
              hour12: true,
              timeZoneName: 'short',
            })}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FearGreedIndex;
