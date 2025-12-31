use std::env;
use std::io::{self, Write};
use std::path::PathBuf;
use std::process::Command;

/// 检测是否在终端会话中运行
fn is_terminal_session() -> bool {
    const TERMINAL_ENV_VARS: &[&str] = &[
        "WT_SESSION",    // Windows Terminal
        "TERM_PROGRAM",  // macOS Terminal
        "VSCODE_PID",    // VSCode
        "ConEmuPID",     // ConEmu
        "ANSICON",       // ANSICON
        "TERM",          // Unix terminal
    ];

    TERMINAL_ENV_VARS
        .iter()
        .any(|var| env::var(var).is_ok())
}

/// 判断是否需要在退出时暂停
fn should_pause_on_exit(args: &[String]) -> bool {
    if args.iter().any(|a| a == "--pause") {
        return true;
    }
    if args.iter().any(|a| a == "--no-pause") {
        return false;
    }
    !is_terminal_session()
}

/// 获取当前 exe 所在目录
fn get_exe_dir() -> PathBuf {
    env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."))
}

/// 等待用户按 Enter
fn pause() {
    print!("\n按 Enter 键关闭窗口...");
    io::stdout().flush().ok();
    let mut input = String::new();
    io::stdin().read_line(&mut input).ok();
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let pause_on_exit = should_pause_on_exit(&args);

    let exe_dir = get_exe_dir();
    let target_exe = exe_dir.join("cli-proxy-api.exe");

    // 检查目标文件是否存在
    if !target_exe.exists() {
        println!("错误: 找不到文件 {}", target_exe.display());
        if pause_on_exit {
            pause();
        }
        return;
    }

    println!("正在启动 {}...", target_exe.display());

    // 启动程序
    match Command::new(&target_exe).current_dir(&exe_dir).status() {
        Ok(status) => {
            let code = status.code().unwrap_or(-1);
            println!("\n程序已退出，返回码: {}", code);
        }
        Err(e) => {
            println!("启动失败: {}", e);
        }
    }

    if pause_on_exit {
        pause();
    }
}
