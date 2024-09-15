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

if os.path.isfile(file_path):
    # 获取文件的绝对路径
    absolute_path = os.path.abspath(file_path)
    # 将\转换为/
    absolute_path = absolute_path.replace('\\', '/')
    print(f"{absolute_path}")

    # 获取所有JetBrains软件的安装路径（通过安装包和Toolbox安装）
    # package_paths = get_jetbrains_installation_paths_package()
    # toolbox_paths = get_jetbrains_installation_paths_toolbox()
    # all_paths = package_paths + toolbox_paths
    all_paths = get_jetbrains_installation_paths_appdata()

    if all_paths:
        action, selected_paths = select_jetbrains_software(all_paths)
        if selected_paths:
            if action == "activate":
                modified_paths = modify_vmoptions_files(
                    selected_paths, absolute_path)
                if modified_paths:
                    show_message(f"成功修改了以下软件的vmoptions文件:\n" +
                                 "\n".join(modified_paths))
                else:
                    show_message("没有软件的vmoptions文件被修改")
            elif action == "restore":
                # 解析selected_paths，'C:\\Users\\xiaoy\\AppData\\Roaming\\JetBrains\\WebStorm2024.2'，获取最后一个\\之后的路径并去掉版本号(类似2024.2)
                # 对idea进行特殊处理，idea只保留idea
                selected_paths_temp = []

                for path in selected_paths:
                    if 'idea' in path.lower():
                        selected_paths_temp.append('idea')
                    else:
                        path = path.replace("\\", "/")
                        path = path.split("/")[-1]
                        path = path.split("20")[0]
                        selected_paths_temp.append(path)

                # 调用get_jetbrains_installation_paths_package和get_jetbrains_installation_paths_toolbox获取所有的安装路径
                all_paths_old = get_jetbrains_installation_paths_package(
                ) + get_jetbrains_installation_paths_toolbox()
                # 遍历all_paths_old，模糊匹配selected_paths_temp中的路径，将匹配到的路径添加/bin 并添加到selected_paths
                # all_paths_old:  [('IntelliJ IDEA 2024.1.4', 'D:\\Program Files\\JetBrains\\IntelliJ IDEA 2024.1.4'), ('PhpStorm 2024.1.1', 'D:\\Program Files\\JetBrains\\PhpStorm 2024.1.1'), ('PyCharm 2024.1.4', 'D:\\Program Files\\JetBrains\\PyCharm 2024.1.4'), ('WebStorm 2024.1.1', 'D:\\Program Files\\JetBrains\\WebStorm 2024.1.1')]
                print('all_paths_old: ', all_paths_old)
                for path in all_paths_old:
                    for selected_path_index_value in selected_paths_temp:

                        if selected_path_index_value.lower() in path[0].lower():
                            print('selected_path_index_value: ',
                                  selected_path_index_value)
                            print('path[0]: ', path[0])
                            selected_paths.append(path[1] + '\\bin')

                print('selected_paths_temp: ', selected_paths_temp)
                print('selected_paths: ', selected_paths)
                restored_paths = restore_vmoptions_files(selected_paths)
                if restored_paths:
                    show_message(f"成功还原了以下软件的vmoptions文件:\n" +
                                 "\n".join(restored_paths))
                else:
                    show_message("没有软件的vmoptions文件被还原")
        else:
            show_message("未选择任何需要操作的软件")
    else:
        show_message("没有找到任何 JetBrains 软件的安装路径")
else:
    show_message(f"'{file_name}' 没有找到ja-netfilter/ja-netfilter.jar")
