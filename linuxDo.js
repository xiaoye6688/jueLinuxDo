// 创建按钮
const button = document.createElement('button');

// 设置按钮的文本内容
button.textContent = '开始自动阅读';

// 设置按钮的样式
button.style.position = 'fixed';
button.style.bottom = '10px'; // 距离底部10像素
button.style.left = '10px';  // 距离左侧10像素
button.style.padding = '10px 20px'; // 按钮内边距
button.style.backgroundColor = '#4CAF50'; // 按钮背景颜色
button.style.color = 'white'; // 按钮文字颜色
button.style.border = 'none'; // 按钮无边框
button.style.borderRadius = '5px'; // 按钮圆角
button.style.cursor = 'pointer'; // 鼠标指针样式

// 定义定时器变量
let timer = null;
let isReading = false;

// 添加点击事件监听器
button.addEventListener('click', function () {
    // 判断链接是不是https://linux.do/，必须是linux.do主页才能使用
    if (window.location.href !== 'https://linux.do/' && isReading === false) {
        alert('请在linux.do主页使用');
        // 跳转到linux.do主页
        window.location.href = 'https://linux.do';
        return;
    }
    if (!isReading) {
        let index = 0;
        // 创建一个定时器，按顺序点击未读文章列表中的每一个
        timer = setInterval(function () {
            // 获取所有未读文章
            const elements = document.querySelectorAll('.badge.badge-notification.new-topic');
            if (elements.length != 0) {
                // alert('正在阅读第' + (index + 1) + '篇文章');
                console.log('正在阅读第' + (index + 1) + '篇文章');
                elements[0].click();
                index++;
                setTimeout(function () {
                    window.history.back();
                }, 3000);
            } else {
                // 定时器任务执行完毕后，触发end事件并跳到页面末尾
                // clearInterval(timer);
                document.dispatchEvent(new Event('end'));

            }
        }, 5000); // 每5秒阅读一篇文章

        // 更改按钮文本
        button.textContent = '暂停自动阅读';
        isReading = true;
    } else {
        // 暂停定时器
        clearInterval(timer);
        // 更改按钮文本
        button.textContent = '开始自动阅读';
        isReading = false;
    }
});

// 将按钮添加到body中
document.body.appendChild(button);

// 处理end事件，跳到页面末尾
document.addEventListener('end', function () {
    window.scrollTo(0, document.body.scrollHeight);
});
