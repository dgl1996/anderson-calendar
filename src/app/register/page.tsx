'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 直接从window对象获取环境变量（构建时不会检查）
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      console.log('🔍 环境变量检查:');
      console.log('URL存在:', !!supabaseUrl);
      console.log('Key存在:', !!supabaseAnonKey);

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('数据库连接配置缺失，请检查环境变量');
      }

      // 动态导入Supabase客户端，避免构建时错误
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // 简化注册：直接调用API，不检查用户是否存在
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('注册成功！请登录。');
        setPhone('');
        setPassword('');
      } else {
        setMessage(`注册失败: ${data.error}`);
      }
    } catch (error: any) {
      console.error('注册错误:', error);
      setMessage(`注册失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">注册账号</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="请输入手机号"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="至少6位字符"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">
          已有账号？<a href="/login" className="text-blue-600 hover:underline">登录</a>
        </p>
      </div>
    </div>
  );
}