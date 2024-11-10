# Bitcoin Explorer

This project is a Bitcoin Explorer that displays real-time on-chain data by interacting with a Bitcoin node and storing data in a PostgreSQL database. This is **Part 1** of a multi-part project, focused on building an end-to-end flow involving a backend, data ingestion in Rust, and a frontend to display the data.

## **Project Overview**

The project aims to:

1. Build a Bitcoin Explorer that displays relevant on-chain data, including the latest block height.
2. Use a **Rust** ingestion program to continually pull data from the Bitcoin client and store it in a **PostgreSQL** database.
3. Provide a **User Interface (UI)** in React (TypeScript) that reads data from the database and displays it to the user in real-time.

## **Technologies Used**
- **Rust** for data ingestion.
- **Node.js (Express)** for the backend server.
- **PostgreSQL** as the database.
- **React with TypeScript** for the frontend UI.
- **Docker** for packaging and deployment. (To be Implemented)
  
## **Getting Started**

### **Prerequisites**
- **Git**: For cloning the repository.
- **Node.js**: For running the backend and frontend.
- **Cargo**: For running the Rust ingestion script.
- **PostgreSQL**: The database that stores blockchain data.
- **Bitcoin Core**: Running a Bitcoin node with RPC enabled.

### **Steps to Set Up and Run the Project**

#### **1. Clone the Repository**
First, clone the repository from GitHub:
```sh
git clone https://github.com/OmkarVaity/Bitcoin-Explorer.git
cd Bitcoin-Explorer
```
### **2. Setup Env variables**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=**********
DB_NAME=btc_explorer
BITCOIN_RPC_USER=omkar
BITCOIN_RPC_PASSWORD==**********
```

### **3. Install Postgres and Setup DB **
1. CREATE DB
CREATE DATABASE btc_explorer;

2. Connect to DB
\c btc_explorer

3. Create the block_info table:

CREATE TABLE block_info (
    id SERIAL PRIMARY KEY,
    block_height INT NOT NULL
);

### **4. Set up Backend **
```
cd backend
npm install
npm run dev
```

### **5. Set up Frontend **
```
cd frontend
npm install 
npm start
```

### **6. Set up Rust Ingestion Script **
```
cd ingestion
cargo run
```

### **7. View UI **
```
Once the backend and frontend are running, open your browser and go to http://localhost:3000.
You should see the current block height displayed in real-time.
```

### **Endpoints **
```
GET /block-height: Returns the latest block height from the database.
Example Response: { "block_height": 410273 } test
```


## **Project by Omkar Vaity**
