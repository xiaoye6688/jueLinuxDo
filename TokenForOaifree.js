// ==UserScript==
// @name        rt自动转at
// @namespace   Violentmonkey Scripts
// @match       https://new.oaifree.com/*
// @grant       none
// @version     2.4
// @description 2024/10/31 简洁美观UI
// @license MIT
// ==/UserScript==

// 初始化用户数据
var users = JSON.parse(localStorage.getItem('users')) || [];

// 创建样式
var style = document.createElement('style');
style.innerHTML = `
    .rt-button {
        display: inline-block;
        cursor: pointer;
        background: linear-gradient(135deg, #6A5ACD, #483D8B);
        border: none;
        color: #fff;
        padding: 6px 6px;
        font-size: 13px;
        border-radius: 4px;
        transition: 0.3s;
    }
    .rt-button:hover {
        background: linear-gradient(135deg, #7B68EE, #4B0082);
    }
    .rt-container {
        position: fixed;
        top: 20px;
        left: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background: #f9f9f9;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 280px;
        padding: 12px;
        z-index: 99999999;
        font-family: Arial, sans-serif;
    }
    .rt-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }
    .rt-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 180px;
        overflow-y: auto;
    }
    .rt-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #e8e8e8;
        font-size: 13px;
    }
    .rt-list-item:last-child {
        border-bottom: none;
    }
    .rt-input-container {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
    }
    .rt-input {
        flex: 1;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 5px;
        font-size: 13px;
        background-color: #fff;
        color: #333;
    }
    .username-container {
        display: inline-block;
        width: 100px; /* 固定宽度 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
document.head.appendChild(style);

// 创建容器
var container = document.createElement('div');
container.className = 'rt-container';

// 添加标题
var title = document.createElement('div');
title.className = 'rt-title';
title.innerHTML = '账户管理';

// 添加输入框和按钮容器
var inputContainer = document.createElement('div');
inputContainer.className = 'rt-input-container';

var refreshTokenInput = document.createElement('input');
refreshTokenInput.className = 'rt-input';
refreshTokenInput.placeholder = 'refresh_token';

var addButton = document.createElement('button');
addButton.className = 'rt-button';
addButton.innerHTML = '添加RT';
addButton.onclick = function () {
    var refreshToken = refreshTokenInput.value.trim();
    if (refreshToken) {
        users.push({ username: '临时名字', refresh_token: refreshToken });
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
        refreshTokenInput.value = '';
    }
};

// 将输入框和按钮添加到容器
inputContainer.appendChild(refreshTokenInput);
inputContainer.appendChild(addButton);

// 创建用户列表
var ul = document.createElement('ul');
ul.className = 'rt-list';

function adjustFontSize(container, text) {
    let fontSize = 13; // 初始字体大小
    container.style.fontSize = fontSize + 'px';
    container.innerText = text;

    // 检查内容宽度是否超出容器宽度
    while (container.scrollWidth > container.clientWidth && fontSize > 10) {
        fontSize--;
        container.style.fontSize = fontSize + 'px';
    }
}

function renderUserList() {
    ul.innerHTML = '';
    users.forEach(function (user, index) {
        var li = document.createElement('li');
        li.className = 'rt-list-item';

        // 用户名显示容器
        var usernameContainer = document.createElement('div');
        usernameContainer.className = 'username-container';

        // 调整字体大小以适应宽度
        adjustFontSize(usernameContainer, user.username);

        // 选择按钮
        var selectButton = document.createElement('button');
        selectButton.className = 'rt-button';
        selectButton.innerHTML = '选择';
        selectButton.onclick = function () {
            getToken(user.refresh_token);
        };

        // 删除按钮
        var deleteButton = document.createElement('button');
        deleteButton.className = 'rt-button';
        deleteButton.innerHTML = '删除';
        deleteButton.onclick = function () {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUserList();
        };

        li.appendChild(usernameContainer);
        li.appendChild(selectButton);
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });
}

// 将内容添加到主容器
container.appendChild(title);
container.appendChild(inputContainer);
container.appendChild(ul);
document.body.appendChild(container);

// 渲染用户列表
renderUserList();

// 获取token的函数
async function getToken(refreshToken) {
    try {
        const response = await fetch('https://token.oaifree.com/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: `refresh_token=${encodeURIComponent(refreshToken)}`
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        const accessToken = result.access_token;
        console.log('access_token:', accessToken);

        const url = 'https://new.oaifree.com/auth/login_token';
        const data = `action=token&access_token=${encodeURIComponent(accessToken)}`;
        console.log('请求数据:', data);

        const loginResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        });

        if (!loginResponse.ok) throw new Error(`HTTP error! status: ${loginResponse.status}`);
        const loginResult = await loginResponse.json();
        console.log('响应数据:', loginResult);

        // 跳转到指定页面
        window.location.href = 'https://new.oaifree.com/';
    } catch (error) {
        console.error('获取token失败:', error);
    }
}
