import React from 'react';
import BitcoinPriceChart from './BitcoinPriceChart'; 

const PricesPage: React.FC = () => {
  return (
    <div>
      <h2>Cryptocurrency Prices</h2>
      <BitcoinPriceChart />
    </div>
  );
};

export default PricesPage;
