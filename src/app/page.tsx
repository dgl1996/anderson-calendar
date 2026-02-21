export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">AnyCalendar - 安德森极简工作日历</h1>
      <p className="text-lg mb-8">专为管理人员设计的极简工作日历</p>
      <div className="space-x-4">
        <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          立即注册
        </a>
        <a href="/login" className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50">
          登录
        </a>
      </div>
    </div>
  );
}
