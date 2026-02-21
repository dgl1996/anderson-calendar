'use client'

import { useState } from 'react'

export default function HomePage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    if (!phone || !password) {
      setMessage('请输入手机号和密码')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/register-no-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 注册成功！请记住您的账号用于登录。')
        setPhone('')
        setPassword('')
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error: any) {
      setMessage(`❌ 网络错误: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!phone || !password) {
      setMessage('请输入手机号和密码')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/login-no-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 登录成功！正在跳转到仪表板...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error: any) {
      setMessage(`❌ 网络错误: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          安德森极简工作日历
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          专为高效工作者设计的简洁日历工具，让您的工作安排更加井然有序。
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">快速测试</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="请输入11位手机号"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="至少6位字符"
                minLength={6}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '处理中...' : '立即注册'}
            </button>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? '处理中...' : '立即登录'}
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-600">
            <p>💡 提示：这是模拟版本，无需配置环境变量即可工作</p>
            <p>测试账号：13800138001 / 123456</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">📅</div>
            <h3 className="font-semibold text-lg mb-2">简洁界面</h3>
            <p className="text-gray-600">去除冗余功能，专注核心日历管理</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">快速操作</h3>
            <p className="text-gray-600">拖拽调整，一键添加，高效便捷</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">🔒</div>
            <h3 className="font-semibold text-lg mb-2">安全存储</h3>
            <p className="text-gray-600">Supabase数据库保障数据安全</p>
          </div>
        </div>
      </div>
    </div>
  )
}