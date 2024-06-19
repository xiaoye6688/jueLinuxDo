import os
from ui_utils import select_jetbrains_software, show_message
from registry_utils import get_jetbrains_installation_paths_package, get_jetbrains_installation_paths_toolbox
from file_utils import modify_vmoptions_files

# 文件名
file_name = 'ja-netfilter.jar'

# 获取当前目录
current_directory = os.getcwd()

# 构建文件路径
file_path = os.path.join(current_directory, file_name)

if os.path.isfile(file_path):
    # 获取文件的绝对路径
    absolute_path = os.path.abspath(file_path)
    # 将\转换为/
    absolute_path = absolute_path.replace('\\', '/')
    print(f"{absolute_path}")

    # 获取所有JetBrains软件的安装路径（通过安装包和Toolbox安装）
    package_paths = get_jetbrains_installation_paths_package()
    toolbox_paths = get_jetbrains_installation_paths_toolbox()
    all_paths = package_paths + toolbox_paths

    if all_paths:
        selected_paths = select_jetbrains_software(all_paths)
        if selected_paths:
            modify_vmoptions_files(selected_paths, absolute_path)
        else:
            show_message("未选择任何需要激活的软件")
    else:
        show_message("没有找到任何 JetBrains 软件的安装路径")
else:
    show_message(f"'{file_name}' 没有找到ja-netfilter/ja-netfilter.jar")
