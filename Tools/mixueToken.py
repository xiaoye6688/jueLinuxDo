import tkinter as tk
from tkinter import messagebox
import requests
import json
import base64
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
import time
import ttkbootstrap as ttkb


def to_sign(app_id, phone_number, time_stamp, phone_code=None):
    if phone_code:
        raw_text = f'appId={app_id}&captcha={phone_code}&mobilePhone={phone_number}&t={time_stamp}'.encode()
    else:
        raw_text = f'appId={app_id}&mobilePhone={phone_number}&t={time_stamp}'.encode()

    base64_key = '''
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbC4pjJol4HdEkdMS+GrmGBjZl6YJQJLbqI+ssR4oEhYrNhSd3fD4t99msPbpsrfwq590uaxvQgos0wifMvwibO/EuM3mfJKsET8JrEomddTywbCM3Jbq+hQErXNv+VVNseRy+1rtSDAx2+gELM9n6zS1ATldXMD+xzYI5hHaHIZqZjp++bDQs3J6+ocQMAyJzwwe0+VfASeGizW1vUJDypQW5yEYWDGUhvYoUM8DQ3EislNkDVZG/5DAZJ83ZDXm8i2zWW+7o9INQXZEByBOUzC/BnIdGxPL6CSOb2pL2HtBWVVFgmMv8994pllyCoQUfiBU31uItxSaQ7x0UdsL5AgMBAAECggEAAosiwz36UKu/9vVoJ3D2AIln7k0E11tlyFg8bdoyzxSh5PsL10ZZDn2XSHm7BXILwI/KsLRLsWMirK0oeycouWy7wzaTzfZGChnG/ylK8coft0i6K/TDM10mA1PjthNVkafiXpDtwekj5+nFQ1UJzfC9+sYuG3QS+USSo4pXOgBzYfIbYbHhZp4UJqf8T7BnD6Tq0SdCz4D7VhllE2AJ8V8NquxRkeYAKnEn1ew6YKhlQ+sonGQ43fwLqkiqgPSNsjT/Smm7JtI2TmA5HhEXBRD5F1OuyW49FJfd5HRj33skpxfhvNtRUSel7yw83z3rhjM+z5eTkA95EM9tcS5hEQKBgQD6wprKtSGtuGIQRhYeSJGYI5BleDPQoID79/b7trJD2VG24YnHO45lVhIWNNYAGN5d+7ed7Pp5KwwCZ83D36Ilp6PJ4o0eyqqOHk9wgi944ydlbMNBJEEQobcjhAr/HqcsI0q//oubxuvXR2Boyo7MRer49Sqk+DBm57ZLXWDCRQKBgQDfn0goh7BsDF62l3LDz/yOq7SqSYdOWg09cLsjFMDX5NkujunktaH46y7kNB4SgI/wo/A6Or4/MqUp4a6L865jovfz4vsHGiE17D4Q7TFM7t7vPAf+x63DHc336UrtB+dH8kXUwDmI3JOQ3h23V5gwEDAc/OhnC4TlPhS9U5JjJQKBgQDyQCisZjpoCnXqRNs/XFoTgWARNwPPrA+P3GjlmgUz2PHBXLfvGpEhQvpsK5UGOQAyCWjFD9iWUEjk1gWKEjUibYalFdHBiockjxGtnodgIQrBSEaFWxHkkGZN0FWTS7iywlGHk9CpqI3UxybTdcRoga9T3f3Zq8+OypFo04gThQKBgBJm2BhFujXZ+r1Jzy7f4aeX56EPteuzq10/9pZXcdsSQPD837BrZe3G5K/wvfzFyZKC2xTfmqI2t7KvmJ55qgMW+RJ/viqCcvMuApl/+0uaaIwFQ58qrVjeDgH1l63TtauM+0QboWBqzlXggU+CDMr/ugXYpgM8xm3a4vgFdYllAoGAOKB1ewREnJ7rFgmHvpDPjxUjmL4wbNb6BPdtyHRg+oHUN65ZWbntrrDAo6X8EdpOFJpIo0sswENpilBy6QIuILbSKnubPvobE5c8b2DBFchrbCwUpQwQOVAF1DFG/c011ygd4wM/JAXe9a2Ikzm/L3hEOh/3ctC24nyljwbAuxY=
    '''

    base64_key = base64_key.strip()
    missing_padding = len(base64_key) % 4
    if missing_padding:
        base64_key += '=' * (4 - missing_padding)

    pem_key_bytes = base64.b64decode(base64_key)
    private_key = RSA.import_key(pem_key_bytes)

    h = SHA256.new(raw_text)
    signature = pkcs1_15.new(private_key).sign(h)
    signature_base64 = base64.b64encode(signature).decode('utf-8')

    sign = signature_base64.replace('+', '-').replace('/', '_')
    return sign


def send_sms(phone_number):
    url = "https://mxsa.mxbc.net/api/v1/app/captchaSms"

    app_id = 'ba660596c1d911ebabac005056883e3e'
    time_stamp = str(int(time.time() * 1000))
    phone_code = None

    headers = {
        "app": "mxbc",
        "appchannel": "xiaomi",
        "appversion": "3.3.6",
        "Access-Token": "",
        "Content-Type": "application/json; charset=UTF-8",
        "Host": "mxsa.mxbc.net",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip",
        "User-Agent": "okhttp/4.4.1"
    }

    sign = to_sign(app_id, phone_number, time_stamp, phone_code)
    data = {
        "mobilePhone": phone_number,
        "t": time_stamp,
        "appId": app_id,
        "sign": sign
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        messagebox.showinfo("Success", "短信发送成功")
    else:
        messagebox.showerror("Error", f"短信发送失败: {response.text}")


def get_token(phone_number, captcha, token_label):
    url = "https://mxsa.mxbc.net/api/v1/app/login"

    app_id = 'ba660596c1d911ebabac005056883e3e'
    time_stamp = str(int(time.time() * 1000))

    headers = {
        "app": "mxbc",
        "appchannel": "xiaomi",
        "appversion": "3.3.6",
        "Access-Token": "",
        "Content-Type": "application/json; charset=UTF-8",
        "Host": "mxsa.mxbc.net",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip",
        "User-Agent": "okhttp/4.4.1"
    }

    sign = to_sign(app_id, phone_number, time_stamp, phone_code=captcha)
    data = {
        "mobilePhone": phone_number,
        "t": time_stamp,
        "captcha": captcha,
        "appId": app_id,
        "sign": sign
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        token = response.json().get('data', {}).get('accessToken', '')
        token_label.config(text=format_token(token))
        messagebox.showinfo("Success", "Token获取成功")
    else:
        messagebox.showerror("Error", f"Token获取失败: {response.text}")


def format_token(token, line_length=40):
    return '\n'.join(token[i:i + line_length] for i in range(0, len(token), line_length))


def copy_to_clipboard(token):
    root.clipboard_clear()
    root.clipboard_append(token)
    messagebox.showinfo("Info", "Token已复制到剪贴板")


def main():
    global root
    root = ttkb.Window(themename="darkly")
    root.title("短信发送")

    # 获取屏幕宽度和高度
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()

    # 设置窗口宽度和高度
    window_width = 310
    window_height = 450

    # 计算窗口的 x 和 y 坐标
    x = (screen_width - window_width) // 2
    y = (screen_height - window_height) // 2

    # 设置窗口的几何形状
    root.geometry(f'{window_width}x{window_height}+{x}+{y}')

    ttkb.Label(root, text="手机号码:").grid(row=0, column=0, padx=10, pady=10)
    phone_number_entry = ttkb.Entry(root)
    phone_number_entry.grid(row=0, column=1, padx=10, pady=10)

    send_sms_button = ttkb.Button(root, text="发送短信", command=lambda: send_sms(phone_number_entry.get()))
    send_sms_button.grid(row=1, columnspan=2, padx=10, pady=10)

    ttkb.Label(root, text="验证码:").grid(row=2, column=0, padx=10, pady=10)
    captcha_entry = ttkb.Entry(root)
    captcha_entry.grid(row=2, column=1, padx=10, pady=10)

    token_label = ttkb.Label(root, text="", wraplength=300, justify="left")
    token_label.grid(row=3, columnspan=2, padx=10, pady=10)

    get_token_button = ttkb.Button(root, text="获取Token",
                                   command=lambda: get_token(phone_number_entry.get(), captcha_entry.get(),
                                                             token_label))
    get_token_button.grid(row=4, columnspan=2, padx=10, pady=10)

    copy_button = ttkb.Button(root, text="复制Token", command=lambda: copy_to_clipboard(token_label.cget("text")))
    copy_button.grid(row=5, columnspan=2, padx=10, pady=10)

    root.mainloop()


if __name__ == "__main__":
    main()
