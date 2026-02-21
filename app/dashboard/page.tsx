'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = () => {
      try {
        // 从localStorage获取用户信息（简化版）
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          // 如果没有用户信息，跳转到登录页面
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 顶部导航栏 */}
        <header className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">工作台</h1>
                <p className="text-gray-600">欢迎回来，{user?.nickname || '用户'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                退出登录
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                返回首页
              </Link>
            </div>
          </div>
        </header>

        {/* 欢迎区域 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-4">欢迎使用安德森日历</h2>
          <p className="text-blue-100 text-lg">
            您已成功登录，可以开始管理您的工作日程了
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-blue-600 text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">日历管理</h3>
            <p className="text-gray-600 mb-4">查看和管理您的每日、每周、每月日程</p>
            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition">
              进入日历
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-green-600 text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">任务管理</h3>
            <p className="text-gray-600 mb-4">创建、跟踪和完成您的日常任务</p>
            <button className="w-full bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition">
              查看任务
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-purple-600 text-3xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">账户设置</h3>
            <p className="text-gray-600 mb-4">管理您的个人信息和账户偏好</p>
            <button className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition">
              设置账户
            </button>
          </div>
        </div>

        {/* 日历预览 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">日历预览</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">月</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">周</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">日</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center py-3 font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`h-16 border border-gray-200 rounded-lg flex items-center justify-center ${
                  day > 28 ? 'text-gray-400' : 'text-gray-700'
                } ${day === 21 ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                {day}
                {day === 21 && (
                  <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 用户信息 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">账户信息</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">手机号</span>
              <span className="font-medium">{user?.phone || '未设置'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">昵称</span>
              <span className="font-medium">{user?.nickname || '用户'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">账户类型</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                免费版
              </span>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>安德森极简工作日历 © 2026 - 专注于高效工作管理</p>
        </footer>
      </div>
    </div>
  )
}