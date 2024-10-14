import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const BitcoinPriceChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
        const data = await response.json();

        // Extracting price and date data
        const prices = data.prices.map((price: [number, number]) => ({
          date: new Date(price[0]).toLocaleDateString(),
          price: price[1], // Bitcoin price
        }));

        setChartData({
          labels: prices.map((point: any) => point.date), // X-axis: Dates
          datasets: [
            {
              label: 'Bitcoin Price (USD)',
              data: prices.map((point: any) => point.price), // Y-axis: Bitcoin prices
              borderColor: '#FF6384',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.4, 
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching Bitcoin price history:', error);
      }
    };

    fetchPriceHistory(); 
  }, []); 

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>Bitcoin Price Chart (Last 30 Days)</h2>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Price (USD)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BitcoinPriceChart;
