import ctypes
import tkinter as tk

def show_message(message):
    ctypes.windll.user32.MessageBoxW(0, message, '提示', 0)

def select_jetbrains_software(paths):
    root = tk.Tk()
    root.title("选择需要激活的JetBrains软件")
    root.geometry("600x400")
    root.resizable(False, False)

    selected_paths = []

    def on_select():
        for var, path in zip(checkbox_vars, paths):
            if var.get():
                selected_paths.append(path[1])
        root.destroy()

    frame = tk.Frame(root)
    frame.pack(pady=10)

    label = tk.Label(frame, text="请选择需要激活的软件：")
    label.pack()

    checkbox_vars = []
    for display_name, install_location in paths:
        var = tk.BooleanVar()
        checkbox = tk.Checkbutton(frame, text=f"{display_name} - {install_location}", variable=var)
        checkbox.pack(anchor=tk.W)
        checkbox_vars.append(var)

    button_frame = tk.Frame(root)
    button_frame.pack(pady=10)

    button_ok = tk.Button(button_frame, text="确定", command=on_select)
    button_ok.pack(side=tk.LEFT, padx=5)

    root.mainloop()
    return selected_paths
