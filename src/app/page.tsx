import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* 导航栏 */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            <h1 className="text-2xl font-bold">安德森极简工作日历</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  登录 / 注册
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                进入日历
              </Link>
            </SignedIn>
          </div>
        </nav>

        {/* 主内容 */}
        <div className="text-center py-20">
          <h2 className="text-5xl font-bold mb-6">
            专注工作，<span className="text-blue-400">极简管理</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            安德森极简工作日历，专为高效工作者设计。简洁界面，强大功能，让您的工作安排更加井然有序。
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg rounded-lg transition transform hover:scale-105">
                立即开始免费使用
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-lg rounded-lg transition transform hover:scale-105 inline-block"
            >
              进入日历工作台
            </Link>
          </SignedIn>
        </div>

        {/* 功能特性 */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">智能日历</h3>
            <p className="text-gray-400">直观的日历视图，支持月/周/日切换</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">安全认证</h3>
            <p className="text-gray-400">使用Clerk提供企业级安全认证</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">极速响应</h3>
            <p className="text-gray-400">基于Next.js 14，提供流畅的用户体验</p>
          </div>
        </div>
      </div>
    </main>
  )
}
