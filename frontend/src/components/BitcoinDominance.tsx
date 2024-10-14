import React, { useState, useEffect } from 'react';
import './MetricsSection.css';

interface DominanceData {
  btc_price_usd: number;
  btc_price_eur: number;
  btc_dominance: number;
}

const BitcoinDominance: React.FC = () => {
  const [dominanceData, setDominanceData] = useState<DominanceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/bitcoin-dominance');
        const data = await response.json();
        console.log('Fetched data:', data); 
        setDominanceData(data);
      } catch (error) {
        console.error('Error fetching Bitcoin dominance:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="metric-card">
      <h3>Bitcoin Market Dominance</h3>
      {dominanceData ? (
        <div>
          <p>USD: ${dominanceData.btc_price_usd.toFixed(2)}</p>
          <p>EUR: €{dominanceData.btc_price_eur.toFixed(2)}</p>
          <p>Dominance: {dominanceData.btc_dominance.toFixed(2)}%</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BitcoinDominance;
