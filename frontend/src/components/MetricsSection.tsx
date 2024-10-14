import React from 'react';
import BitcoinPrice from './BitcoinPrice';
import BitcoinDominance from './BitcoinDominance';
import BitcoinVolume from './BitcoinVolume';
import FearGreedIndex from './FearGreedIndex';
import TransactionCountChart from './TransactionCountChart';
import './MetricsSection.css';

const MetricsSection: React.FC = () => {
  return (
    <div className="metrics-section">
      <div className="metric-container">
        <div className="metric-card">
          <h3>Bitcoin Price</h3>
          <BitcoinPrice />
        </div>

        <div className="metric-card">
          <h3>Bitcoin Market Dominance</h3>
          <BitcoinDominance />
        </div>

        <div className="metric-card">
          <h3>Bitcoin 24h Trading Volume</h3>
          <BitcoinVolume />
        </div>

        <div className="metric-card">
          <h3>Bitcoin Fear and Greed Index</h3>
          <FearGreedIndex />
        </div>
      </div>

      <div className="chart-container">
        <h2>Bitcoin Transaction Count per Block</h2>
        <TransactionCountChart />
      </div>
    </div>
  );
};

export default MetricsSection;