import ctypes
import sys
import ttkbootstrap as ttk
from ttkbootstrap.constants import *


def show_message(message):
    ctypes.windll.user32.MessageBoxW(0, message, '提示', 0)


def select_jetbrains_software(paths):
    root = ttk.Window(themename="cosmo")  # 使用 cosmo 主题
    root.title("选择需要修改的JetBrains软件 | actIDEA 2.1")
    root.geometry("600x400")
    root.resizable(False, False)

    action = ttk.StringVar(value="activate")
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

    def _on_mouse_wheel(event):
        canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    root.update_idletasks()  # 更新窗口信息
    x = (root.winfo_screenwidth() - 600) / 2
    y = (root.winfo_screenheight() - 400) / 2
    root.geometry(f"600x400+{int(x)}+{int(y)}")

    root.protocol("WM_DELETE_WINDOW", on_close)

    frame = ttk.Frame(root, padding=10)
    frame.pack(pady=10, fill=BOTH, expand=True)

    label_action = ttk.Label(frame, text="请选择操作类型：")
    label_action.pack()

    action_frame = ttk.Frame(frame)
    action_frame.pack(pady=5)

    radio_activate = ttk.Radiobutton(action_frame, text="激活软件", variable=action, value="activate",
                                     bootstyle="primary")
    radio_activate.pack(side=LEFT, padx=10)

    radio_restore = ttk.Radiobutton(action_frame, text="还原软件", variable=action, value="restore",
                                    bootstyle="primary")
    radio_restore.pack(side=LEFT, padx=10)

    # 创建全选和标签的 frame
    select_all_frame = ttk.Frame(frame)
    select_all_frame.pack(pady=5, fill=X)

    var_select_all = ttk.BooleanVar()
    select_all_checkbox = ttk.Checkbutton(select_all_frame, text="全选", variable=var_select_all, command=select_all,
                                          bootstyle="primary")
    select_all_checkbox.pack(side=LEFT)

    label = ttk.Label(select_all_frame, text="请选择需要操作的软件：")
    label.pack(side=LEFT, padx=10)

    # 创建一个 Canvas 和 Scrollbar，设置 Canvas 的最大高度
    canvas_frame = ttk.Frame(frame)
    canvas_frame.pack(fill=BOTH, expand=True)

    canvas = ttk.Canvas(canvas_frame, height=200)  # 设置 Canvas 高度
    scrollbar = ttk.Scrollbar(canvas_frame, orient=VERTICAL, command=canvas.yview, bootstyle="round")
    scrollable_frame = ttk.Frame(canvas)

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    scrollbar.pack(side=RIGHT, fill=Y)
    canvas.pack(side=LEFT, fill=BOTH, expand=True)

    # 绑定鼠标滚轮事件
    canvas.bind_all("<MouseWheel>", _on_mouse_wheel)

    checkbox_vars = []
    for display_name, install_location in paths:
        var = ttk.BooleanVar()
        checkbox = ttk.Checkbutton(scrollable_frame, text=f"{display_name} - {install_location}", variable=var,
                                   bootstyle="primary")
        checkbox.pack(anchor=W)
        checkbox_vars.append(var)

    button_frame = ttk.Frame(root, padding=10)
    button_frame.pack(pady=10)

    button_ok = ttk.Button(button_frame, text="确定", command=on_select, bootstyle="success")
    button_ok.pack(side=LEFT, padx=5)

    button_cancel = ttk.Button(button_frame, text="取消", command=on_cancel, bootstyle="danger")
    button_cancel.pack(side=LEFT, padx=5)

    root.mainloop()
    return action.get(), selected_paths
