import os
from ui_utils import select_jetbrains_software, show_message
from registry_utils import get_jetbrains_installation_paths_package, get_jetbrains_installation_paths_toolbox, get_jetbrains_installation_paths_appdata
from file_utils import modify_vmoptions_files, restore_vmoptions_files

# 文件名
file_name = 'ja-netfilter.jar'

# 获取当前目录
current_directory = os.getcwd()

# 构建文件路径
file_path = os.path.join(current_directory, file_name)


def get_absolute_path(file_path):
    """获取文件的绝对路径并将\转换为/"""
    return os.path.abspath(file_path).replace('\\', '/')


def handle_activation(selected_paths, absolute_path):
    """处理激活操作"""
    modified_paths = modify_vmoptions_files(selected_paths, absolute_path)
    if modified_paths:
        show_message(f"成功修改了以下软件的vmoptions文件:\n" + "\n".join(modified_paths))
    else:
        show_message("没有软件的vmoptions文件被修改")


def handle_restore(selected_paths):
    """处理还原操作"""
    selected_paths_temp = []
    for path in selected_paths:
        if 'idea' in path.lower():
            selected_paths_temp.append('idea')
        else:
            path = path.replace("\\", "/").split("/")[-1].split("20")[0]
            selected_paths_temp.append(path)

    all_paths_old = get_jetbrains_installation_paths_package(
    ) + get_jetbrains_installation_paths_toolbox()
    for path in all_paths_old:
        for selected_path in selected_paths_temp:
            if selected_path.lower() in path[0].lower():
                selected_paths.append(path[1] + '\\bin')

    restored_paths = restore_vmoptions_files(selected_paths)
    if restored_paths:
        show_message(f"成功还原了以下软件的vmoptions文件:\n" + "\n".join(restored_paths))
    else:
        show_message("没有软件的vmoptions文件被还原")


if os.path.isfile(file_path):
    absolute_path = get_absolute_path(file_path)
    # print(f"{absolute_path}")

    all_paths = get_jetbrains_installation_paths_appdata()
    if all_paths:
        action, selected_paths = select_jetbrains_software(all_paths)
        if selected_paths:
            if action == "activate":
                handle_activation(selected_paths, absolute_path)
            elif action == "restore":
                handle_restore(selected_paths)
        else:
            show_message("未选择任何需要操作的软件")
    else:
        show_message("没有找到任何 JetBrains 软件的安装路径")
else:
    show_message(f"'{file_name}' 没有找到ja-netfilter/ja-netfilter.jar")
