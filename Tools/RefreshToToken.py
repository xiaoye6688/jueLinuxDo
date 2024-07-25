import asyncio
import aiohttp
from urllib.parse import urlencode
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import pyperclip
from tkinter import messagebox, scrolledtext


async def get_token(refresh_token):
    url = 'https://token.oaifree.com/api/auth/refresh'
    headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    body = urlencode({'refresh_token': refresh_token})

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=body) as response:
            if response.status == 200:
                result = await response.json()
                access_token = result.get('access_token')
                if access_token:
                    return access_token
                else:
                    return None
            else:
                return None


async def fetch_tokens(refresh_tokens):
    tasks = [get_token(rt) for rt in refresh_tokens]
    return await asyncio.gather(*tasks)


def on_copy_token(token):
    pyperclip.copy(token)
    messagebox.showinfo("复制成功", "Token已复制到剪贴板")


def on_get_tokens_button_click(refresh_token_entry, table_frame, status_label):
    refresh_tokens = refresh_token_entry.get("1.0", ttk.END).strip().split('\n')
    asyncio.run(fetch_tokens_and_update_ui(refresh_tokens, table_frame, status_label))


async def fetch_tokens_and_update_ui(refresh_tokens, table_frame, status_label):
    tokens = await fetch_tokens(refresh_tokens)
    for widget in table_frame.winfo_children():
        widget.destroy()

    for i, token in enumerate(tokens):
        frame = ttk.Frame(table_frame)
        frame.pack(fill='x', pady=2)

        token_entry = ttk.Entry(frame, width=60)
        token_entry.insert(0, token if token else "获取失败")
        token_entry.configure(state='readonly')
        token_entry.pack(side='left', padx=25)

        copy_button = ttk.Button(frame, text="复制", command=lambda t=token: on_copy_token(t))
        copy_button.pack(side='left', padx=0)

    if any(tokens):
        status_label.config(text="Token获取完成", bootstyle="success")
    else:
        status_label.config(text="获取Token失败", bootstyle="danger")


def main():
    root = ttk.Window()
    root.withdraw()  # 隐藏窗口

    root.title("Token获取器")
    root.geometry("600x400")

    # 使窗口居中
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry('{}x{}+{}+{}'.format(width, height, x, y))

    ttk.Label(root, text="Refresh Tokens (每行一个):").pack(pady=10)
    refresh_token_entry = ttk.Text(root, width=60, height=5)
    refresh_token_entry.pack(pady=5)

    get_tokens_button = ttk.Button(root, text="获取Tokens",
                                   command=lambda: on_get_tokens_button_click(refresh_token_entry, table_frame,
                                                                              status_label))
    get_tokens_button.pack(pady=10)

    canvas_frame = ttk.Frame(root)
    canvas_frame.pack(fill='both', expand=True, padx=20)

    canvas = ttk.Canvas(canvas_frame)
    scrollbar_y = ttk.Scrollbar(canvas_frame, orient='vertical', command=canvas.yview)
    scrollbar_y.pack(side='right', fill='y')

    table_frame = ttk.Frame(canvas)
    canvas.create_window((0, 0), window=table_frame, anchor='nw')

    canvas.configure(yscrollcommand=scrollbar_y.set)
    canvas.pack(side='left', fill='both', expand=True)

    table_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    status_label = ttk.Label(root, text="", bootstyle="info")
    status_label.pack(pady=5, side='top')

    root.deiconify()  # 显示窗口

    root.mainloop()


if __name__ == "__main__":
    main()
