import os
import tkinter as tk
from tkinter import filedialog, messagebox
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import pyperclip  # 导入pyperclip库


def get_directory_structure(root_dir, exclude=None):
    if exclude is None:
        exclude = []
    structure = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        if any(excluded in dirpath for excluded in exclude):
            continue
        level = dirpath.replace(root_dir, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        structure.append(f'{indent}{os.path.basename(dirpath)}/')
        for f in filenames:
            structure.append(f'│   ' * level + f'├── {f}')
    return '\n'.join(structure)


def select_directory():
    directory = filedialog.askdirectory()
    if directory:
        entry_dir.delete(0, tk.END)
        entry_dir.insert(0, directory)


def on_text_click(event):
    """Clear the text box on first click if it's a placeholder."""
    if text_structure.get("1.0", tk.END).strip() == '在此输入目录或生成目录到此':
        text_structure.delete('1.0', tk.END)
        text_structure.config(fg='black')


def on_text_focusout(event):
    """Reset placeholder if the text box is empty."""
    if text_structure.get("1.0", tk.END).strip() == '':
        text_structure.insert('1.0', '在此输入目录或生成目录到此')
        text_structure.config(fg='black')


def generate_structure():
    root_dir = entry_dir.get()
    if not root_dir:
        messagebox.showerror("错误", "请选择一个目录！")
        return

    exclude_dirs = [e.strip() for e in entry_exclude.get().split(',') if e.strip()]
    try:
        structure = get_directory_structure(root_dir, exclude=exclude_dirs)
        text_structure.delete('1.0', tk.END)
        text_structure.insert('1.0', structure)
        pyperclip.copy(structure)  # 将生成的目录结构复制到剪贴板
        messagebox.showinfo("完成", "目录结构已显示并复制到剪贴板！")
    except Exception as e:
        messagebox.showerror("错误", f"生成目录结构时出错: {str(e)}")


def create_directory_structure():
    root_dir = entry_dir.get()
    if not root_dir:
        messagebox.showerror("错误", "请选择一个目录！")
        return

    structure = text_structure.get('1.0', tk.END).strip()
    if not structure:
        messagebox.showerror("错误", "请先生成目录结构！")
        return

    try:
        lines = structure.split('\n')
        current_path = root_dir
        for line in lines:
            level = line.count('│   ')
            item = line.strip().split('── ')[-1]

            if item.endswith('/'):
                # 创建目录
                current_path = os.path.join(current_path, item.rstrip('/'))
                os.makedirs(current_path, exist_ok=True)
            else:
                # 创建文件
                file_path = os.path.join(current_path, item)
                # 确保目录存在
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                open(file_path, 'a').close()

        messagebox.showinfo("完成", "目录结构已成功创建！")
    except Exception as e:
        messagebox.showerror("错误", f"创建目录结构时出错: {str(e)}")


# 创建主窗口
app = ttk.Window(themename='litera')
app.title("目录结构生成器")

# 设置窗口大小
window_width = 600
window_height = 500
app.geometry(f"{window_width}x{window_height}")

# 获取屏幕尺寸
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

# 计算位置坐标
center_x = int(screen_width / 2 - window_width / 2)
center_y = int(screen_height / 2 - window_height / 2)

# 设置窗口位置
app.geometry(f'+{center_x}+{center_y}')

# 创建主框架
frame = ttk.Frame(app, padding="10")
frame.pack(fill=tk.BOTH, expand=True)

# 目录选择部分
ttk.Label(frame, text="选择目录:").pack(anchor=tk.W)
entry_dir = ttk.Entry(frame, width=50)
entry_dir.pack(fill=tk.X, pady=(0, 5))
ttk.Button(frame, text="浏览", command=select_directory).pack(anchor=tk.E, pady=(0, 10))

# 排除目录输入部分
ttk.Label(frame, text="排除的文件夹 (用逗号分隔):").pack(anchor=tk.W)
entry_exclude = ttk.Entry(frame, width=50)
entry_exclude.pack(fill=tk.X, pady=(0, 10))

# 按钮框架
button_frame = ttk.Frame(frame)
button_frame.pack(fill=tk.X, pady=10)

# 生成按钮
ttk.Button(button_frame, text="读取目录结构并复制", bootstyle=PRIMARY, command=generate_structure).pack(side=tk.LEFT,
                                                                                                        padx=(0, 10))

# 创建目录按钮
ttk.Button(button_frame, text="根据文本创建目录", bootstyle=SUCCESS, command=create_directory_structure).pack(
    side=tk.LEFT)

# 显示结构的文本框
text_structure = ttk.Text(frame, height=15, width=75, fg='black')
text_structure.pack(fill=tk.BOTH, expand=True, pady=10)
text_structure.insert('1.0', '在此输入目录或生成目录到此')
text_structure.bind('<FocusIn>', on_text_click)
text_structure.bind('<FocusOut>', on_text_focusout)

# 为文本框添加滚动条
scrollbar = ttk.Scrollbar(frame, orient="vertical", command=text_structure.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
text_structure.configure(yscrollcommand=scrollbar.set)

# 运行应用
app.mainloop()
