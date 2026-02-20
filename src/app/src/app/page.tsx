'use client';

import { useState } from 'react';

export default function Home() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.style.backgroundColor = theme === 'light' ? '#000' : '#fff';
    document.body.style.color = theme === 'light' ? '#fff' : '#000';
  };

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>安德森极简工作日历</h1>
      <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
        切换主题（当前：{theme === 'light' ? '浅色' : '深色'}）
      </button>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>功能区域</h2>
        <p>日历任务管理 + 记事本</p>
        <p>（功能开发中...）</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/register" style={{ marginRight: '10px' }}>注册</a>
        <a href="/login">登录</a>
      </div>
    </main>
  );
}