import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface TransactionData {
  block_height: number;
  transaction_count: number;
}

const TransactionCountChart: React.FC = () => {
  const [data, setData] = useState<TransactionData[]>([]);
  const [maxTransactionCount, setMaxTransactionCount] = useState<number>(1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/transaction-count');
        setData(response.data);

        const maxCount = Math.max(...response.data.map((d: TransactionData) => d.transaction_count));
        setMaxTransactionCount(maxCount > 1000 ? maxCount : 1000); 
      } catch (error) {
        console.error('Error fetching transaction count data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Fetch every 1 second

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="block_height" />
        <YAxis domain={[0, maxTransactionCount]} /> 
        <Tooltip />
        <Line type="monotone" dataKey="transaction_count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TransactionCountChart;
