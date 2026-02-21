'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟用户登录状态检查
    const checkUser = async () => {
      try {
        // 这里可以添加实际的用户状态检查逻辑
        // 目前先模拟一个用户
        setUser({
          name: '用户',
          email: 'user@example.com'
        });
      } catch (error) {
        console.error('用户检查失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = () => {
    // 这里可以添加实际的注销逻辑
    alert('已注销');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xl">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            <h1 className="text-2xl font-bold">工作台</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">欢迎, {user?.name}</div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              注销
            </button>
          </div>
        </div>

        {/* 欢迎区域 */}
        <div className="bg-gray-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-2">欢迎使用安德森日历</h2>
          <p className="text-gray-400">您已成功登录，可以开始使用日历功能</p>
        </div>

        {/* 日历容器 */}
        <div className="bg-gray-800/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">日历视图</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">月</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">周</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">日</button>
            </div>
          </div>

          {/* 日历网格 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center py-2 font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* 功能区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-3">快速添加</h4>
              <input 
                type="text" 
                placeholder="输入事件内容" 
                className="w-full p-3 bg-gray-700 rounded-lg mb-3"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg">
                添加事件
              </button>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-3">今日安排</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="font-medium">团队会议</div>
                  <div className="text-sm text-gray-400">10:00 - 11:30</div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="font-medium">项目评审</div>
                  <div className="text-sm text-gray-400">14:00 - 15:30</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-3">系统状态</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">数据库连接</span>
                  <span className="text-green-500">正常</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">用户认证</span>
                  <span className="text-green-500">已启用</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">日历同步</span>
                  <span className="text-yellow-500">待配置</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 返回主页 */}
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← 返回主页
          </a>
        </div>
      </div>
    </div>
  );
}