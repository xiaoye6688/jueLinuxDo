import winreg

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
                        jetAppPaths.append((display_name, install_location))
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
                    display_name, _ = winreg.QueryValueEx(sub_key, "DisplayName")
                    install_location, _ = winreg.QueryValueEx(sub_key, "InstallLocation")
                    jetAppPaths.append((display_name, install_location))
            except FileNotFoundError:
                pass
            finally:
                sub_key.Close()
    except FileNotFoundError:
        pass
    finally:
        key.Close()
    return jetAppPaths
