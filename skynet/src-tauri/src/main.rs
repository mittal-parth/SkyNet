// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![testpy])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
