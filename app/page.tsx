import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          安德森极简工作日历
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          专为高效工作者设计的简洁日历工具，让您的工作安排更加井然有序。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            立即注册
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gray-200 text-gray-800 text-lg rounded-lg hover:bg-gray-300 transition"
          >
            已有账号？登录
          </Link>
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