# 这是一个工具合集，记录一些我自己平时编写并使用的小工具

## actIDEA

这是一个用于激活jetbrains系列的工具，目前仅适用于windows系统，使用方法如下：
- 下载并解压名为actIDEA.rar的激活整合包

- [从github下载](https://github.com/xiaoye6688/jueLinuxDo/releases/tag/v2.1.1)

- [蓝奏云](https://ww0.lanzoub.com/iVslF25j05fc)

- 将解压后的文件夹放在任意位置，双击运行actIDEA.exe，选择需要修改的jetbrains产品，点击激活。

- 文件修改后打开你的jetbrains软件，在激活链接处填入`https://jbls.ide-soft.com/`

  或手动打开[https://jbls.ide-soft.com/](https://jbls.ide-soft.com/) 使用linuxdo账号登录，获取激活码，填入激活码即可激活。

## Tools
  - osPath
    - 这是一个用于将路径转换为文本或将文本转换为路径的小工具，适用于GPT等人工智能无法读取整个项目的情况。
    - 使用方法如下：
      - 下载并解压名为osPath.exe的文件，双击运行，选择需要转换为文本的文件夹或在文本框中输入特定格式的路径，点击`读取目录结构并复制`或`根据文本创建目录`即可。
      - [从github下载](https://github.com/xiaoye6688/jueLinuxDo/releases/tag/osPath)
      - 目录结构示例
        ```
            example_directory/
            ├── folder1/
            │   ├── file1.txt
            │   ├── file2.txt
            ├── folder2/
            │   ├── subfolder1/
            │   │   ├── file3.txt
        ```
  - RefreshToToken
    - 这是一个用于将chatGPT的refresh_token转换为access_token的小工具，适用于在access_token过期后使用refresh_token重新获取access_token
    - 使用始皇的`https://token.oaifree.com/api/auth/refresh`接口
    - 可批量转换多个refresh_token，但是还没想好复制的时候应该复制为什么格式，所以暂时只支持单个复制
    - 使用方法如下：
      - 下载并解压名为RefreshToToken.rar的文件，双击运行RefreshToToken.exe，输入refresh_token，点击`获取access_token`即可。
      - [从github下载](https://github.com/xiaoye6688/jueLinuxDo/releases/tag/Refresh_tokenToAccess_token)
  

## Stargazers over time
[![Stargazers over time](https://starchart.cc/xiaoye6688/jueLinuxDo.svg?variant=adaptive)](https://starchart.cc/xiaoye6688/jueLinuxDo)
