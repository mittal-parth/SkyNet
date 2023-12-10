// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json;
use std::process::Command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_weights() -> String {
    let python_command = Command::new("python3").arg("train.py");
    let file = std::fs::File::open("/home/mehul/.skynet/weights_final.json").unwrap();
    let reader = std::io::BufReader::new(file);
    let weights: serde_json::Value = serde_json::from_reader(reader).unwrap();
    println!("{:?}", weights);
    return weights.to_string();
}

#[tauri::command]
fn store_weights(weights: String) -> String {
    let json: serde_json::Value = serde_json::from_str(&weights).unwrap();
    let file = std::fs::File::create("/home/mehul/.skynet/weights.json").unwrap();
    let writer = std::io::BufWriter::new(file);
    serde_json::to_writer_pretty(writer, &json).unwrap();
    return "success".to_string();
}

#[tauri::command]
fn store_n(weights: &str, number: &str) -> String {
    // convert string to json
    let json: serde_json::Value = serde_json::from_str(weights).unwrap();
    // write to a json file called weights_final.json
    let file_name = format!("weights{}.json", number);
    let file = std::fs::File::create(file_name).unwrap();
    let writer = std::io::BufWriter::new(file);
    serde_json::to_writer_pretty(writer, &json).unwrap();
    return "success".to_string();
}

#[tauri::command]
fn aggregator(number: &str) -> String {
    let python_command = Command::new("python3")
        .arg("aggregator.py")
        .arg(number)
        .output();
    let file = std::fs::File::open("weights_final.json").unwrap();
    let reader = std::io::BufReader::new(file);
    let weights: serde_json::Value = serde_json::from_reader(reader).unwrap();
    println!("{:?}", weights);
    return weights.to_string();
}

#[tauri::command]
fn deploy() -> String {
    let python_command = Command::new("python3").arg("contract_model.py").output();
    let forge = Command::new(
        "forge create --rpc-url https://sepolia-rpc.scroll.io/ \
  --value 0.00000000002ether \
  --constructor-args 1696118400 \
  --private-key 0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1 \
  --legacy Verifier.sol:Halo2Verifier",
    )
    .output();
    return "success".to_string();
}

#[tauri::command]
fn initialize() -> String {
    let file = std::fs::File::open("test.json").unwrap();
    let reader = std::io::BufReader::new(file);
    let weights: serde_json::Value = serde_json::from_reader(reader).unwrap();
    println!("{:?}", weights);
    return weights.to_string();
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_weights,
            store_weights,
            store_n,
            aggregator,
            initialize
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
