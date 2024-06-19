import os


def modify_vmoptions_files(paths, absolute_path):
    modified_paths = []
    for path in paths:
        path = path.replace('\\', '/') + '/bin'
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
                    if not any('--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED' in line for line in
                               lines) and \
                            not any(
                                '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED' in line for line
                                in lines):
                        f.write(
                            '\n--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n'
                            '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED\n\n'
                            f'-javaagent:{absolute_path}\n'
                        )
                        modified_paths.append(file_path)
                        break
                    else:
                        f.seek(0)
                        lines = [line for line in lines if '-javaagent:' not in line]
                        lines = [line for line in lines if
                                 '--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED' not in line]
                        lines = [line for line in lines if
                                 '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED' not in line]
                        f.truncate(0)
                        f.writelines(lines)
                        f.write(f'-javaagent:{absolute_path}\n')
                        modified_paths.append(file_path)
                        break
    return modified_paths


def restore_vmoptions_files(paths):
    restored_paths = []
    for path in paths:
        path = path.replace('\\', '/') + '/bin'
        file_list = os.listdir(path)
        for file in file_list:
            if file.endswith('.vmoptions') and 'client' not in file:
                file_path = os.path.join(path, file)
                with open(file_path, 'r+') as f:
                    lines = f.readlines()
                    if any('-javaagent:' in line for line in lines) or \
                            any('--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED' in line for line in
                                lines) or \
                            any('--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED' in line for line
                                in lines):
                        # 移除不需要的行
                        lines = [line for line in lines if '-javaagent:' not in line]
                        lines = [line for line in lines if
                                 '--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED' not in line]
                        lines = [line for line in lines if
                                 '--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED' not in line]
                        # 移除所有空行
                        lines = [line for line in lines if line.strip()]
                        # 清空文件并写入处理后的内容
                        f.seek(0)
                        f.truncate(0)
                        f.writelines(lines)
                        restored_paths.append(file_path)
                        break
    return restored_paths
