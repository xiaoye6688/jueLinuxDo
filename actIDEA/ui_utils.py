import ctypes
import tkinter as tk
import sys


def show_message(message):
    ctypes.windll.user32.MessageBoxW(0, message, '提示', 0)


def select_jetbrains_software(paths):
    root = tk.Tk()
    root.title("选择需要修改的JetBrains软件 | actIDEA 2.1")
    root.geometry("600x400")
    root.resizable(False, False)

    action = tk.StringVar(value="activate")
    selected_paths = []

    def on_select():
        for var, path in zip(checkbox_vars, paths):
            if var.get():
                selected_paths.append(path[1])
        root.destroy()

    def on_cancel():
        root.destroy()
        sys.exit()

    def on_close():
        root.destroy()
        sys.exit()

    def select_all():
        select_all_state = var_select_all.get()
        for var in checkbox_vars:
            var.set(select_all_state)

    root.update_idletasks()  # 更新窗口信息
    x = (root.winfo_screenwidth() - 600) / 2
    y = (root.winfo_screenheight() - 400) / 2
    root.geometry(f"600x400+{int(x)}+{int(y)}")

    root.protocol("WM_DELETE_WINDOW", on_close)

    frame = tk.Frame(root)
    frame.pack(pady=10, fill="both", expand=True)

    label_action = tk.Label(frame, text="请选择操作类型：")
    label_action.pack()

    action_frame = tk.Frame(frame)
    action_frame.pack(pady=5)

    radio_activate = tk.Radiobutton(action_frame, text="激活软件", variable=action, value="activate")
    radio_activate.pack(side=tk.LEFT, padx=10)

    radio_restore = tk.Radiobutton(action_frame, text="还原软件", variable=action, value="restore")
    radio_restore.pack(side=tk.LEFT, padx=10)

    # 创建全选和标签的 frame
    select_all_frame = tk.Frame(frame)
    select_all_frame.pack(pady=5, fill="x")

    var_select_all = tk.BooleanVar()
    select_all_checkbox = tk.Checkbutton(select_all_frame, text="全选", variable=var_select_all, command=select_all)
    select_all_checkbox.pack(side=tk.LEFT)

    label = tk.Label(select_all_frame, text="请选择需要操作的软件：")
    label.pack(side=tk.LEFT, padx=10)

    # 创建一个 Canvas 和 Scrollbar，设置 Canvas 的最大高度
    canvas_frame = tk.Frame(frame)
    canvas_frame.pack(fill="both", expand=True)

    canvas = tk.Canvas(canvas_frame, height=200)  # 设置 Canvas 高度
    scrollbar = tk.Scrollbar(canvas_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas)

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    scrollbar.pack(side="right", fill="y")
    canvas.pack(side="left", fill="both", expand=True)

    checkbox_vars = []
    for display_name, install_location in paths:
        var = tk.BooleanVar()
        checkbox = tk.Checkbutton(scrollable_frame, text=f"{display_name} - {install_location}", variable=var)
        checkbox.pack(anchor=tk.W)
        checkbox_vars.append(var)

    button_frame = tk.Frame(root)
    button_frame.pack(pady=10)

    button_ok = tk.Button(button_frame, text="确定", command=on_select)
    button_ok.pack(side=tk.LEFT, padx=5)

    button_cancel = tk.Button(button_frame, text="取消", command=on_cancel)
    button_cancel.pack(side=tk.LEFT, padx=5)

    root.mainloop()
    return action.get(), selected_paths
