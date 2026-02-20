'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('注册成功！');
      } else {
        setMessage('注册失败：' + data.error);
      }
    } catch (error) {
      setMessage('网络错误，请重试');
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>用户注册</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>手机号：</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>密码：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          注册
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('成功') ? 'green' : 'red' }}>{message}</p>}
      <p style={{ marginTop: '20px' }}>
        <a href="/">返回首页</a>
      </p>
    </main>
  );
}