// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;
use tauri::{command, Window};
use tauri_plugin_oauth::start;
use std::collections::HashMap;
use url::Url;


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn testpy() -> String {
    let python_command = Command::new("python3").arg("test.py").output();

    match python_command {
        Ok(output) => {
            if output.status.success() {
                let result = String::from_utf8_lossy(&output.stdout);
                println!("Python output: {}", result);
                return result.to_string();
            } else {
                let result = String::from_utf8_lossy(&output.stderr);
                // eprintln!("Python error: {}", result);
                return result.to_string();
            }
        }
        Err(e) => {
            eprintln!("Error running Python command: {}", e);
            return e.to_string();
        }
    }
}

#[tauri::command]
async fn start_server(window: Window) -> Result<u16, String> {
    start(move |url| {
        // Because of the unprotected localhost port, you must verify the URL here.
        // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.
        // let _ = window.emit("redirect_uri", url);
        let url = url::Url::parse(&url).unwrap();

        // get the code query parameter
        let code = url
            .query_pairs()
            .find(|(k, _)| k == "code")
            .unwrap_or_default()
            .1;
    
        // get the state query parameter
        let state = url
            .query_pairs()
            .find(|(k, _)| k == "state")
            .unwrap_or_default()
            .1;
    
        // create map of query parameters
        let mut query_params = HashMap::new();
    
        query_params.insert("code".to_string(), code.to_string());
        query_params.insert("state".to_string(), state.to_string());
        query_params.insert(String::from("redirect_uri"), url.to_string());
    
        if window.emit("redirect_uri", query_params).is_ok() {
            println!("Sent redirect_uri event");
        } else {
            println!("Failed to send redirect_uri event");
        }
    })
    .map_err(|err| err.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![testpy])
        .invoke_handler(tauri::generate_handler![start_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
