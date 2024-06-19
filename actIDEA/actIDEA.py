import os
import winreg
import ctypes
import tkinter as tk

# 文件名
file_name = 'ja-netfilter.jar'

# 获取当前目录
current_directory = os.getcwd()

# 构建文件路径
file_path = os.path.join(current_directory, file_name)

# JetBrains软件的名称
jetbrains_software_names = [
    "IntelliJ IDEA",
    "PyCharm",
    "WebStorm",
    "PhpStorm",
    "CLion",
    "Rider",
    "RubyMine",
    "AppCode",
    "DataGrip",
    "GoLand",
    "JetBrains DataSpell",
    "JetBrains Fleet",
    "JetBrains Gateway",
    "JetBrains Gateway Client",
    "JetBrains Gateway Server",
]


# 获取所有JetBrains软件的安装路径（通过安装包安装）
def get_jetbrains_installation_paths_package():
    jetAppPaths = []
    try:
        # 打开注册表项
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
                             r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall")
        for i in range(0, winreg.QueryInfoKey(key)[0]):
            sub_key_name = winreg.EnumKey(key, i)
            sub_key = winreg.OpenKey(key, sub_key_name)
            try:
                display_name, _ = winreg.QueryValueEx(sub_key, "DisplayName")
                for software_name in jetbrains_software_names:
                    if software_name in display_name:
                        install_location, _ = winreg.QueryValueEx(sub_key, "InstallLocation")
                        jetAppPaths.append(install_location)
                        break
            except FileNotFoundError:
                pass
            finally:
                sub_key.Close()
    except FileNotFoundError:
        pass
    finally:
        key.Close()
    return jetAppPaths


# 获取所有JetBrains软件的安装路径（通过Toolbox安装）
def get_jetbrains_installation_paths_toolbox():
    jetAppPaths = []
    try:
        # 打开注册表项
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                             r"Software\Microsoft\Windows\CurrentVersion\Uninstall")
        for i in range(0, winreg.QueryInfoKey(key)[0]):
            sub_key_name = winreg.EnumKey(key, i)
            sub_key = winreg.OpenKey(key, sub_key_name)
            try:
                publisher, _ = winreg.QueryValueEx(sub_key, "Publisher")
                if publisher == "JetBrains s.r.o.":
                    install_location, _ = winreg.QueryValueEx(sub_key, "InstallLocation")
                    jetAppPaths.append(install_location)
            except FileNotFoundError:
                pass
            finally:
                sub_key.Close()
    except FileNotFoundError:
        pass
    finally:
        key.Close()
    return jetAppPaths


def show_message(message):
    ctypes.windll.user32.MessageBoxW(0, message, '提示', 0)


def select_installation_method():
    root = tk.Tk()
    root.title("选择安装方式（美丽激活2.0）")
    root.geometry("400x150")
    root.resizable(False, False)
    # 弹出在屏幕中央
    root.update_idletasks()
    x = (root.winfo_screenwidth() - root.winfo_reqwidth()) / 2 - 110
    y = (root.winfo_screenheight() - root.winfo_reqheight()) / 2 - 75
    root.geometry("+%d+%d" % (x, y))

    var = tk.StringVar(value="package")

    label = tk.Label(root, text="请选择安装方式：")
    label.pack(pady=10)

    radio1 = tk.Radiobutton(root, text="通过安装包安装", variable=var, value="package")
    radio1.pack(anchor=tk.W, padx=20)

    radio2 = tk.Radiobutton(root, text="通过Toolbox安装(激活方式由 L站@土豆教主 提供)", variable=var, value="toolbox")
    radio2.pack(anchor=tk.W, padx=20)

    def on_select():
        root.destroy()

    button_frame = tk.Frame(root)
    button_frame.pack(pady=10)

    button_ok = tk.Button(button_frame, text="确定", command=on_select)
    button_ok.pack(side=tk.LEFT, padx=5)

    root.mainloop()
    return var.get()


if os.path.isfile(file_path):
    # 获取文件的绝对路径
    absolute_path = os.path.abspath(file_path)
    # 将\转换为/
    absolute_path = absolute_path.replace('\\', '/')
    print(f"{absolute_path}")

    selected_option = select_installation_method()

    if selected_option == "package":
        # 获取所有JetBrains软件的安装路径（通过安装包安装）
        paths = get_jetbrains_installation_paths_package()
    elif selected_option == "toolbox":
        # 获取所有JetBrains软件的安装路径（通过Toolbox安装）
        paths = get_jetbrains_installation_paths_toolbox()
    else:
        show_message("未选择安装方式")
        exit(1)

    if paths:
        for path in paths:
            # 将\转换为/，拼接/bin
            path = path.replace('\\', '/') + '/bin'
            show_message(f"JetBrains 软件路径: {path}")
            # 获取path路径下所有文件名列表
            file_list = os.listdir(path)
            # 获取以vmoptions结尾且文件名不包含client的文件并修改，在文件末尾添加
            # --add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
            # --add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED
            #
            # -javaagent:C:/Users/xiaoy/Desktop/jh/ja-netfilter/ja-netfilter.jar 该路径为ja-netfilter.jar的绝对路径
            for file in file_list:
                if file.endswith('.vmoptions') and 'client' not in file:
                    file_path = os.path.join(path, file)
                    with open(file_path, 'r+') as f:
                        lines = f.readlines()
                        # 检查文件中是否已经有这两行
                        if not any(
                                '--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED' in line for line in
                                lines) and \
                                not any(
                                    '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED' in line for
                                    line
                                    in lines):
                            f.write(
                                '\n--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n'
                                '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED\n\n'
                                f'-javaagent:{absolute_path}\n'
                            )
                            show_message(f"修改文件: {file} 成功")
                            break
                        else:
                            # 删除所有带有javaagent的行
                            f.seek(0)
                            lines = [line for line in lines if '-javaagent:' not in line]
                            f.truncate(0)
                            f.writelines(lines)
                            # 添加新的javaagent行
                            f.write(
                                f'-javaagent:{absolute_path}\n'
                            )
                            show_message(f"修改文件: {file} 成功")
                            break
    else:
        show_message("没有找到任何 JetBrains 软件的安装路径")

else:
    show_message(f"'{file_name}' 没有找到ja-netfilter/ja-netfilter.jar")
