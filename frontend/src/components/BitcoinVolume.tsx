import React, { useState, useEffect } from 'react';
import './MetricsSection.css';

interface VolumeData {
  price_usd: number;
  price_eur: number;
  volume_usd: number;
}

const BitcoinVolume: React.FC = () => {
  const [volumeData, setVolumeData] = useState<VolumeData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://198.211.106.160:5000/bitcoin-volume');
        const data = await response.json();
        setVolumeData(data);
      } catch (error) {
        console.error('Error fetching Bitcoin volume:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="metric-card">
      <h3>Bitcoin 24h Trading Volume</h3>
      {volumeData ? (
        <div>
          <p>USD: ${volumeData.price_usd.toFixed(2)}</p>
          <p>EUR: €{volumeData.price_eur.toFixed(2)}</p>
          <p>24h Volume (USD): ${volumeData.volume_usd.toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BitcoinVolume;
