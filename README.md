# 这是一个工具合集，记录一些我自己平时编写并使用的小工具

## actIDEA

这是一个用于激活jetbrains系列的工具，目前仅适用于windows系统，使用方法如下：
- 下载并解压名为actIDEA.rar的激活整合包

- [从github下载](https://github.com/xiaoye6688/jueLinuxDo/releases/tag/v2.1.1)

- [蓝奏云](https://wwse.lanzoub.com/iSRoC299gpxa)

- 将解压后的文件夹放在任意位置，双击运行actIDEA.exe，选择需要修改的jetbrains产品，点击激活。

- 文件修改后打开你的jetbrains软件，在激活链接处填入`https://jbls.ide-soft.com/`

  或手动打开[https://jbls.ide-soft.com/](https://jbls.ide-soft.com/) 使用linuxdo账号登录，获取激活码，填入激活码即可激活。

> 注：该方案来自linuxdo佬友youku，软件仅供学习交流使用，请于24小时内删除，不得用于商业用途，否则后果自负。

## Tools
  - osPath
    - 这是一个用于将路径转换为文本或将文本转换为路径的小工具，适用于GPT等人工智能无法读取整个项目的情况。
    - 使用方法如下：
      - 下载名为osPath.exe的文件，双击运行，选择需要转换为文本的文件夹或在文本框中输入特定格式的路径，点击`读取目录结构并复制`或`根据文本创建目录`即可。
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
      - 下载名为RefreshToToken.rar的文件，双击运行RefreshToToken.exe，输入refresh_token，点击`获取access_token`即可。
      - [从github下载](https://github.com/xiaoye6688/jueLinuxDo/releases/tag/Refresh_tokenToAccess_token)
  
  - IAS_zh_cn.cmd
    - IAS的汉化版本，激活某*DM下载器
    - 下载名为IAS_zh_cn.cmd的文件，双击运行，根据提示操作即可。
    - github地址：[IAS_zh_cn](https://github.com/xiaoye6688/jueLinuxDo/blob/main/Tools/IAS_zh_cn.cmd) | [单击下载](https://raw.githubusercontent.com/xiaoye6688/jueLinuxDo/refs/heads/main/Tools/IAS_zh_cn.cmd)
    - *注：该工具仅供学习交流使用，请于24小时内删除，不得用于商业用途，否则后果自负。
    - 原英文版地址：[https://github.com/lstprjct/IDM-Activation-Script](https://github.com/lstprjct/IDM-Activation-Script)

## Internxt VPN.yaml
  - 这是一个由L站佬友逆向的chrome插件Internxt VPN的配置进行简单修改后的配置，目前还能用，但是不保证以后还能用
  - 使用方法如下：
    - 下载名为Internxt VPN.yaml的文件，导入到clash中即可使用
    - 或直接使用链接导入订阅`https://raw.githubusercontent.com/xiaoye6688/jueLinuxDo/main/Internxt%20VPN.yaml`
    - cloudflare workers订阅链接`https://vpn.020906.xyz/`
  
## TokenForOaifree.js
  - 这是一个用于将chatGPT的refresh_token转换为access_token的油猴脚本，在Pandor界面使用，适用于在access_token过期后使用refresh_token重新获取access_token
  - 支持存储多个rt和其对应的at，方便多账户切换，如果你在网址规则中添加 [https://new.oaifree.com/](https://new.oaifree.com/) ，他甚至可以在你的聊天界面快速切换多个账户
  - 使用始皇的`https://token.oaifree.com/api/auth/refresh`接口，全程无需科学上网（请保证自己可以访问[token.oaifree.com](https://token.oaifree.com)）
  - 若提示错误（添加/刷新）失败请关闭科学上网后再试
  - 使用方法如下：
    - 打开(https://greasyfork.org/zh-CN/scripts/500442-rt自动转at)[https://greasyfork.org/zh-CN/scripts/500442-rt%E8%87%AA%E5%8A%A8%E8%BD%ACat]安装脚本即可
    - [从github下载](https://github.com/xiaoye6688/jueLinuxDo/blob/main/linuxDo.js)
    - 效果如下图
    - ![效果图](img/TokenForOaifree.png)

## star记录
[![Stargazers over time](https://starchart.cc/xiaoye6688/jueLinuxDo.svg?variant=adaptive)](https://starchart.cc/xiaoye6688/jueLinuxDo)
