// ==UserScript==
// @name        rt自动转at
// @namespace   Violentmonkey Scripts
// @match       https://new.oaifree.com/*
// @grant       none
// @version     2.7
// @description 2024/10/31 增加日志显示功能
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333;
    }
    .rt-log {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: 4px 8px;
        border-radius: 5px;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: none;
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

// 日志显示容器
var logDiv = document.createElement('div');
logDiv.className = 'rt-log';
container.appendChild(logDiv);

// 显示日志函数
function showLog(message, isError = false) {
    logDiv.innerText = message;
    logDiv.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.75)';
    logDiv.style.display = 'block';
    logDiv.style.opacity = '1';

    // 3秒后隐藏日志
    setTimeout(() => {
        logDiv.style.opacity = '0';
        setTimeout(() => {
            logDiv.style.display = 'none';
        }, 300); // 与过渡效果同步
    }, 3000);
}

// 添加输入框和按钮容器
var inputContainer = document.createElement('div');
inputContainer.className = 'rt-input-container';

var refreshTokenInput = document.createElement('input');
refreshTokenInput.className = 'rt-input';
refreshTokenInput.placeholder = 'refresh_token';

var addButton = document.createElement('button');
addButton.className = 'rt-button';
addButton.innerHTML = '添加RT';
addButton.onclick = async function () {
    var refreshToken = refreshTokenInput.value.trim();
    if (refreshToken) {
        showLog('添加中...');
        try {
            const accessToken = await fetchAccessToken(refreshToken);
            const email = extractEmail(accessToken);

            if (email) {
                users.push({ username: email, refresh_token: refreshToken, access_token: accessToken });
                localStorage.setItem('users', JSON.stringify(users));
                renderUserList();
                showLog('添加成功');
            }
        } catch (error) {
            showLog('添加失败', true);
            console.error('添加用户时出错:', error);
        }
        refreshTokenInput.value = '';
    }
};

// 将输入框和按钮添加到容器
inputContainer.appendChild(refreshTokenInput);
inputContainer.appendChild(addButton);

// 创建用户列表
var ul = document.createElement('ul');
ul.className = 'rt-list';

// 获取最大用户名长度
function getMaxUsernameWidth() {
    const testDiv = document.createElement('div');
    testDiv.className = 'username-container';
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    document.body.appendChild(testDiv);

    let maxWidth = 100;
    users.forEach(user => {
        testDiv.innerText = user.username;
        maxWidth = Math.max(maxWidth, testDiv.scrollWidth);
    });

    document.body.removeChild(testDiv);
    return maxWidth;
}

function adjustFontSize(container, text) {
    let fontSize = 13;
    container.style.fontSize = fontSize + 'px';
    container.innerText = text;

    while (container.scrollWidth > container.clientWidth && fontSize > 10) {
        fontSize--;
        container.style.fontSize = fontSize + 'px';
    }
}

function renderUserList() {
    ul.innerHTML = '';
    const maxUsernameWidth = getMaxUsernameWidth();
    const containerWidth = maxUsernameWidth + 200; // 留出按钮的空间

    container.style.width = containerWidth + 'px';

    users.forEach(function (user, index) {
        var li = document.createElement('li');
        li.className = 'rt-list-item';

        var usernameContainer = document.createElement('div');
        usernameContainer.className = 'username-container';
        usernameContainer.style.width = maxUsernameWidth + 'px';
        adjustFontSize(usernameContainer, user.username);

        var selectButton = document.createElement('button');
        selectButton.className = 'rt-button';
        selectButton.innerHTML = '选择';
        selectButton.onclick = function () {
            // 使用已有的 access_token，而不是重新获取
            showLog('选择用户中...');
            getToken(user.access_token);
            showLog('选择成功');
        };

        var refreshButton = document.createElement('button');
        refreshButton.className = 'rt-button';
        refreshButton.innerHTML = '刷新';
        refreshButton.onclick = async function () {
            showLog('刷新中...');
            try {
                const newAccessToken = await fetchAccessToken(user.refresh_token);
                user.access_token = newAccessToken;
                localStorage.setItem('users', JSON.stringify(users));
                showLog('刷新成功');
                console.log('Access token 已刷新:', newAccessToken);
            } catch (error) {
                showLog('刷新失败', true);
                console.error('刷新 access token 失败:', error);
            }
        };

        var deleteButton = document.createElement('button');
        deleteButton.className = 'rt-button';
        deleteButton.innerHTML = '删除';
        deleteButton.onclick = function () {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUserList();
            showLog('删除成功');
        };

        li.appendChild(usernameContainer);
        li.appendChild(selectButton);
        li.appendChild(refreshButton);
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

// 通过refresh_token获取access_token
async function fetchAccessToken(refreshToken) {
    const response = await fetch('https://token.oaifree.com/api/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `refresh_token=${encodeURIComponent(refreshToken)}`
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.access_token;
}

// 从access_token中提取email
function extractEmail(accessToken) {
    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload["https://api.openai.com/profile"].email || '未知用户';
    } catch (error) {
        console.error('解码access_token时出错:', error);
        return '未知用户';
    }
}

// 获取token的函数
async function getToken(accessToken) {
    try {
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

        window.location.href = 'https://new.oaifree.com/';
    } catch (error) {
        showLog('获取 token 失败', true);
        console.error('获取token失败:', error);
    }
}
