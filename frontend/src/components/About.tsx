import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1>About Bitcoin Explorer</h1>
            <p>
                Welcome to Bitcoin Explorer, your go-to platform for monitoring and exploring the Bitcoin blockchain. 
                Our tool provides detailed insights into recent block transactions, real-time price data, and historical metrics, 
                ensuring you stay informed about the Bitcoin network's activity and trends.
            </p>
            <h2>Our Mission</h2>
            <p>
                At Bitcoin Explorer, our mission is to make the Bitcoin network transparent and accessible to everyone. 
                Whether you are a trader, developer, or simply curious about Bitcoin, our platform provides the tools and 
                information needed to track transactions, analyze blocks, and understand the intricacies of the Bitcoin blockchain.
            </p>
            <h2>Features</h2>
            <ul>
                <li><strong>Real-Time Data:</strong> Access up-to-the-minute information on Bitcoin transactions and blocks.</li>
                <li><strong>Detailed Insights:</strong> View comprehensive details about each block, including transaction counts and fees.</li>
                <li><strong>Price Monitoring:</strong> Keep track of Bitcoin's price movements with real-time price data.</li>
                <li><strong>Analytics:</strong> Use advanced analytics to gain a deeper understanding of the Bitcoin network.</li>
            </ul>
            <h2>Contact Us</h2>
            <p>
                We are always looking to improve and expand our platform. If you have any suggestions or encounter any issues, 
                please do not hesitate to <a href="mailto:support@bitcoinexplorer.com">contact us</a>. Your feedback is invaluable to us.
            </p>
        </div>
    );
};

export default About;
