import React, { useEffect, useState } from 'react';
import './MetricsSection.css';

const BitcoinPrice: React.FC = () => {
  const [priceUsd, setPriceUsd] = useState<number | null>(null);
  const [priceEur, setPriceEur] = useState<number | null>(null);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('http://198.211.106.160:5000/bitcoin-price');
      const data = await response.json();
      setPriceUsd(data.price_usd);
      setPriceEur(data.price_eur);
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
    }
  };

  // Fetch Bitcoin price every 10 seconds
  useEffect(() => {
    fetchBitcoinPrice();
    const intervalId = setInterval(fetchBitcoinPrice, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="metric-card">
      <h3>Bitcoin Price</h3>
      <p>USD: {priceUsd ? `$${priceUsd}` : 'Loading...'}</p>
      <p>EUR: {priceEur ? `€${priceEur}` : 'Loading...'}</p>
    </div>
  );
};

export default BitcoinPrice;
