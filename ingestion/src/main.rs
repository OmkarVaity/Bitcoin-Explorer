use reqwest;
use tokio;
use tokio_postgres::{NoTls, Error};
use std::time::Duration;
use dotenv::dotenv;
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

    loop {
        let mut price_usd: f64 = 0.0;
        let mut price_eur: f64 = 0.0;
        let mut volume_usd: f64 = 0.0;

        // Fetch block height from the Bitcoin Core
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
            if let Some(block_height) = response_json["result"].as_i64() {
                let block_height: i32 = block_height as i32;

                 // Fetch block hash for the latest block from Bitcoin Core
                 let block_hash_response = client
                 .post(bitcoin_client_url)
                 .basic_auth(&bitcoin_rpc_user, Some(&bitcoin_rpc_password))
                 .json(&serde_json::json!({
                     "jsonrpc": "1.0",
                     "id": "curltest",
                     "method": "getblockhash",
                     "params": [block_height]
                 }))
                 .send()
                 .await?;

             if block_hash_response.status().is_success() {
                 let block_hash_json: serde_json::Value = block_hash_response.json().await?;
                 if let Some(block_hash) = block_hash_json["result"].as_str() {
                     // Use Blockstream API to get transaction count for the block
                     let block_url = format!("{}{}", "https://blockstream.info/api/block/", block_hash);
                     let tx_count_response = client.get(&block_url).send().await?;

                     if tx_count_response.status().is_success() {
                         let tx_count_json: serde_json::Value = tx_count_response.json().await?;
                         if let Some(tx_count) = tx_count_json["tx_count"].as_i64() {
                             // Insert transaction count into the database
                             db_client.execute(
                                 "INSERT INTO block_info (block_height, transaction_count) VALUES ($1, $2)",
                                 &[&block_height, &tx_count],
                             ).await?;

                             println!("Transaction count: {} for block height: {} ingested successfully", tx_count, block_height);
                         } else {
                             eprintln!("Failed to parse transaction count");
                         }
                     } else {
                         eprintln!("Failed to fetch transaction count from Blockstream API");
                     }
                 } else {
                     eprintln!("Failed to parse block hash");
                 }
             } else {
                 eprintln!("Failed to fetch block hash: {:?}", block_hash_response.text().await?);
             }
         } else {
             eprintln!("Failed to parse block height");
         }
     } else {
         eprintln!("Failed to get block height: {:?}", response.text().await?);
     }

        // Fetch Bitcoin price and 24-hour volume from CoinGecko API
        let price_response = client
            .get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_24hr_vol=true")
            .send()
            .await?;

        if price_response.status().is_success() {
            let price_json: serde_json::Value = price_response.json().await?;
            if let (Some(price_usd_val), Some(price_eur_val), Some(volume_usd_val)) = (
                price_json["bitcoin"]["usd"].as_f64(),
                price_json["bitcoin"]["eur"].as_f64(),
                price_json["bitcoin"]["usd_24h_vol"].as_f64(),
            ) {
                price_usd = price_usd_val;
                price_eur = price_eur_val;
                volume_usd = volume_usd_val;

                db_client.execute(
                    "INSERT INTO bitcoin_price (price_usd, price_eur, volume_usd) VALUES ($1, $2, $3)",
                    &[&price_usd, &price_eur, &volume_usd],
                ).await?;

                println!("Bitcoin price (USD): ${}, (EUR): €{}, Volume: ${} ingested successfully", price_usd, price_eur, volume_usd);
            } else {
                eprintln!("Failed to parse price or volume");
            }
        } else {
            eprintln!("Failed to fetch Bitcoin price: {:?}", price_response.text().await?);
        }

        // Fetch global market cap for Bitcoin Dominance
        let global_response = client
            .get("https://api.coingecko.com/api/v3/global")
            .send()
            .await?;

        if global_response.status().is_success() {
            let global_json: serde_json::Value = global_response.json().await?;
            if let Some(global_market_cap_usd) = global_json["data"]["total_market_cap"]["usd"].as_f64() {
                let btc_market_cap = price_usd * 21000000.0;
                let btc_dominance = (btc_market_cap / global_market_cap_usd) * 100.0;

                db_client.execute(
                    "INSERT INTO bitcoin_metrics (btc_price_usd, btc_price_eur, btc_dominance, volume_usd) VALUES ($1, $2, $3, $4)",
                    &[&price_usd, &price_eur, &btc_dominance, &volume_usd],
                ).await?;

                println!(
                    "Bitcoin price (USD): ${}, (EUR): €{}, Dominance: {}%, Volume: ${}",
                    price_usd, price_eur, btc_dominance, volume_usd
                );
            } else {
                eprintln!("Failed to parse global market cap");
            }
        } else {
            eprintln!("Failed to fetch global market cap: {:?}", global_response.text().await?);
        }

        tokio::time::sleep(Duration::from_secs(10)).await;
    }
}
