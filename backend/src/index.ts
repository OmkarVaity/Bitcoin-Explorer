import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { error, log } from 'console';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config({path: '../.env'}); 

const app = express();  
const port = 5000;
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());   
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
});

app.get('/block-height', async(req, res) => {
    try{
        const result = await pool.query('SELECT block_height FROM block_info ORDER BY id DESC LIMIT 1');
        if(result.rows.length > 0) {
            res.json({ block_height: result.rows[0].block_height });
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch(err){
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/bitcoin-price', async (req, res) => {
    try {
        const result = await pool.query('SELECT price_usd, price_eur, price_timestamp FROM bitcoin_price ORDER BY price_timestamp DESC LIMIT 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/bitcoin-dominance', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT btc_price_usd, btc_price_eur, btc_dominance FROM bitcoin_metrics ORDER BY id DESC LIMIT 1'
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/bitcoin-volume', async (req, res) => {
    try {
        const result = await pool.query('SELECT price_usd, price_eur, volume_usd FROM bitcoin_price ORDER BY id DESC LIMIT 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/bitcoin-price-history', async (req, res) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
      const data = await response.json();
  
      const formattedData = data.prices.map((price: [number, number]) => ({
        date: new Date(price[0]).toISOString(),
        price_usd: price[1],
      }));
  
      res.json(formattedData);
    } catch (err) {
      console.error('Error fetching Bitcoin price history:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/bitcoin-fear-greed', async (req, res) => {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      res.json(data.data[0]);
    } catch (err) {
      console.error('Error fetching Fear and Greed Index:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/order-book', async (req, res) => {
    try {
        const result = await pool.query('SELECT bids, asks FROM bitcoin_order_book ORDER BY timestamp DESC LIMIT 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/transaction-count', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT block_height, transaction_count FROM block_info ORDER BY block_height DESC LIMIT 10'
        );
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    log(`Server is running on port ${port}`);
});