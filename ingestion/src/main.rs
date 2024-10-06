use reqwest;
use tokio;
use tokio_postgres::{ NoTls , Error};
use std::time::Duration;
use dotenv:: dotenv;
use std::env;

#[tokio::main]  
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    let postgres_user = env::var("DB_USER")?;
    let postgres_password = env::var("DB_PASSWORD")?;
    let postgres_db = env::var("DB_NAME")?;
    let bitcoin_rpc_user = env::var("BITCOIN_RPC_USER")?;
    let bitcoin_rpc_password = env::var("BITCOIN_RPC_PASSWORD")?;
    let postgres_host = env::var("DB_HOST")?;

    let db_connection_string = format!(
        "host={} user={} password={} dbname={}",
        postgres_host, postgres_user, postgres_password, postgres_db
    );


    let (db_client, connection) = tokio_postgres::connect(&db_connection_string, NoTls).await?;
    
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Database connection error: {}", e);
        }
    });


    let bitcoin_client_url = "http://localhost:8332";

    let client = reqwest::Client::new();

    loop{
        let response = client
            .post(bitcoin_client_url)
            .basic_auth(&bitcoin_rpc_user, Some(&bitcoin_rpc_password))
            .json(&serde_json::json!({
                "jsonrpc": "1.0",
                "id": "curltest",
                "method": "getblockcount",
                "params": []
            }))
            .send()
            .await?;
    
    if response.status().is_success() {
        let response_json: serde_json::Value = response.json().await?;
        let block_height = response_json["result"].as_i64().unwrap();
        let block_height: i32 = block_height as i32;

        db_client.execute(
            "INSERT INTO block_info (block_height) VALUES ($1)", &[&block_height],).await?;

            println!("Block height: {} ingested successfully", block_height);
    } else{
        eprintln!("Failed to get block height: {:?}", response.text().await?);
    }

    tokio::time::sleep(Duration::from_secs(10)).await;   
    }
}
