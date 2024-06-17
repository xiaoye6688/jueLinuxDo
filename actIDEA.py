import os
import winreg
import ctypes

# 文件名
file_name = 'ja-netfilter.jar'

# 获取当前目录
current_directory = os.getcwd()

# 构建文件路径
file_path = os.path.join(current_directory, file_name)

# 获取JetBrains软件的安装路径
def get_jetbrains_installation_paths():
    paths = []
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
                    paths.append(install_location)
            except FileNotFoundError:
                pass
            finally:
                sub_key.Close()
    except FileNotFoundError:
        pass
    finally:
        key.Close()
    return paths

def show_message(message):
    ctypes.windll.user32.MessageBoxW(0, message, '提示', 0)

if os.path.isfile(file_path):
    # 获取文件的绝对路径
    absolute_path = os.path.abspath(file_path)
    # 将\转换为/
    absolute_path = absolute_path.replace('\\', '/')
    print(f" {absolute_path}")

    # 获取所有JetBrains软件的安装路径
    paths = get_jetbrains_installation_paths()
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