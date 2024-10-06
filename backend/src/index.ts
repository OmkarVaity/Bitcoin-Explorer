import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { error, log } from 'console';

dotenv.config({path: '../.env'}); // Load environment variables from .env file

const app = express(); 
const port = 5000;

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

app.listen(port, () => {
    log(`Server is running on port ${port}`);
});