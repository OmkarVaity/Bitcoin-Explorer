import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlockHeight.css';

const BlockHeight: React.FC = () => {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);

    useEffect(() => {
        const fetchBlockHeight = async () => {
            try {
                const response = await axios.get<{ block_height: number }>('http://localhost:5000/block-height');
                setBlockHeight(response.data.block_height);
            } catch (err) {
                console.error('Error fetching block height:', err);
            }
        };
        fetchBlockHeight();
        const interval = setInterval(fetchBlockHeight, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="block-height-section">
            <div className="block-height-container">
                <div className="bitcoin-symbol">
                    <span>₿</span>
                </div>
                <div className="block-height-info">
                    <h2>Block Height</h2>
                    {blockHeight !== null ? (
                        <p className="block-height-value">{blockHeight}</p> 
                    ) : (
                    <p>Loading...</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default BlockHeight;
