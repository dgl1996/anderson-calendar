import { UserButton } from '@clerk/nextjs'

export default function DashboardPage() {
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
            <UserButton afterSignOutUrl="/" />
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
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">月</button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">周</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">日</button>
            </div>
          </div>
          
          {/* 模拟日历 */}
          <div className="grid grid-cols-7 gap-2">
            {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
              <div key={day} className="text-center py-2 font-semibold text-gray-400">
                {day}
              </div>
            ))}
            
            {Array.from({ length: 35 }).map((_, i) => (
              <div 
                key={i} 
                className="h-24 bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition cursor-pointer"
              >
                <div className="text-right text-sm text-gray-500">{i + 1}</div>
                {i % 7 === 0 && (
                  <div className="mt-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    会议
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800/20 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-2">📝 添加事件</h4>
            <p className="text-gray-400 text-sm">快速创建新的日历事件</p>
          </div>
          
          <div className="bg-gray-800/20 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-2">📊 数据统计</h4>
            <p className="text-gray-400 text-sm">查看您的工作时间分布</p>
          </div>
          
          <div className="bg-gray-800/20 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-2">⚙️ 设置</h4>
            <p className="text-gray-400 text-sm">个性化您的日历偏好</p>
          </div>
        </div>
      </div>
    </div>
  )
}
