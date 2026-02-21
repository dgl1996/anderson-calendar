'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 诊断：检查环境变量
console.log('🔍 注册页面环境变量诊断:');
console.log('NEXT_PUBLIC_SUPABASE_URL 存在:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 存在:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('NEXT_PUBLIC_SUPABASE_URL 值:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 长度:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0);

// 创建Supabase客户端
let supabase;
try {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  console.log('✅ Supabase客户端创建成功');
} catch (error) {
  console.error('❌ Supabase客户端创建失败:', error);
  supabase = null;
}

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔍 注册表单提交诊断:');
    console.log('手机号:', phone);
    console.log('密码长度:', password.length);
    console.log('Supabase客户端状态:', supabase ? '正常' : '创建失败');

    try {
      if (!supabase) {
        throw new Error('Supabase客户端初始化失败，请检查环境变量');
      }

      // 诊断：测试Supabase连接
      console.log('🔍 测试Supabase连接...');
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('❌ Supabase连接测试失败:', testError);
        throw new Error('数据库连接失败: ' + testError.message);
      }
      console.log('✅ Supabase连接测试成功');

      // 检查手机号是否已存在
      console.log('🔍 检查手机号是否已存在...');
      const { data: existingUser, error: queryError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (queryError) {
        console.error('❌ 查询用户失败:', queryError);
        throw new Error('查询用户失败: ' + queryError.message);
      }

      if (existingUser) {
        console.log('❌ 手机号已存在:', phone);
        throw new Error('该手机号已注册');
      }

      // 创建新用户
      console.log('🔍 创建新用户...');
      const { data, error } = await supabase
        .from('users')
        .insert({
          phone,
          password_hash: password, // 简化：先明文存储
          nickname: `用户${phone.slice(-4)}`,
          plan: 'free'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 创建用户失败:', error);
        throw new Error('注册失败: ' + error.message);
      }

      console.log('✅ 用户注册成功:', data.id);
      alert('注册成功！');
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('❌ 注册过程异常:', err);
      setError(err.message);
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
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">
          已有账号？<a href="/login" className="text-blue-600 hover:underline">登录</a>
        </p>
      </div>
    </div>
  );
}