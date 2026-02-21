'use client'

import { useEffect, useState } from 'react'

export default function EnvCheckPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkEnvironment = async () => {
      const status = {
        timestamp: new Date().toISOString(),
        url: window.location.origin,
        
        // 客户端环境变量（构建时注入）
        clientVars: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
            ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...`
            : '未设置'
        },
        
        // 检查API端点
        apiEndpoints: {
          register: '/api/register',
          login: '/api/login'
        }
      }
      
      setEnvStatus(status)
      
      // 测试API端点
      try {
        const response = await fetch('/api/register', {
          method: 'GET'
        })
        const apiData = await response.json()
        setApiStatus({
          success: true,
          data: apiData,
          status: response.status
        })
      } catch (error: any) {
        setApiStatus({
          success: false,
          error: error.message,
          details: error
        })
      } finally {
        setLoading(false)
      }
    }
    
    checkEnvironment()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">检查环境配置中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">环境配置诊断</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">环境变量状态</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">部署时间</span>
              <span className="font-mono">{envStatus?.timestamp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">网站地址</span>
              <span className="font-mono">{envStatus?.url}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                envStatus?.clientVars.NEXT_PUBLIC_SUPABASE_URL === '未设置' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {envStatus?.clientVars.NEXT_PUBLIC_SUPABASE_URL === '未设置' 
                  ? '❌ 未设置' 
                  : '✅ 已配置'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                envStatus?.clientVars.NEXT_PUBLIC_SUPABASE_ANON_KEY === '未设置' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {envStatus?.clientVars.NEXT_PUBLIC_SUPABASE_ANON_KEY === '未设置' 
                  ? '❌ 未设置' 
                  : '✅ 已配置'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">API端点测试</h2>
          {apiStatus?.success ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>API端点工作正常</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(apiStatus.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-red-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>API端点测试失败</span>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700">{apiStatus?.error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">配置说明</h2>
          <div className="space-y-3 text-blue-600">
            <p>如果环境变量显示"未设置"，请在Vercel中配置：</p>
            <div className="bg-white p-4 rounded-lg">
              <pre className="text-sm">
{`SUPABASE_URL = https://xhieusmegjfdfnrdxlmj.supabase.co
SUPABASE_ANON_KEY = sb_publishable_pi9ObcawUGJAKAnm0O8-kg_jUDsskoH`}
              </pre>
            </div>
            <p>配置完成后，点击"重新部署"按钮。</p>
          </div>
        </div>
      </div>
    </div>
  )
}