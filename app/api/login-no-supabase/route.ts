import { NextResponse } from 'next/server'

// 模拟用户数据库（内存存储）
const mockUsers = new Map<string, any>()

// 初始化一些测试用户
mockUsers.set('13800138001', {
  id: 'mock_user_001',
  phone: '13800138001',
  password_hash: '123456',
  nickname: '测试用户001',
  plan: 'free',
  created_at: '2026-02-21T12:00:00Z',
  updated_at: '2026-02-21T12:00:00Z'
})

export async function POST(request: Request) {
  try {
    console.log('🔍 模拟登录API调用（无需Supabase）')
    
    // 解析请求体
    const body = await request.json()
    const { phone, password } = body

    console.log('📱 登录信息:', { phone, passwordLength: password?.length })

    // 验证输入
    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '手机号和密码不能为空'
        },
        { status: 400 }
      )
    }

    // 查找用户
    const user = mockUsers.get(phone)
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在'
        },
        { status: 404 }
      )
    }

    // 验证密码（简化：直接比较明文）
    if (user.password_hash !== password) {
      return NextResponse.json(
        {
          success: false,
          error: '密码错误'
        },
        { status: 401 }
      )
    }

    console.log('✅ 模拟用户登录成功:', user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        plan: user.plan
      },
      message: '登录成功（模拟模式）',
      note: '此为模拟登录，数据仅存储在内存中'
    })
  } catch (error: any) {
    console.error('❌ 模拟登录API异常:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '服务器内部错误'
      },
      { status: 500 }
    )
  }
}

// 支持GET请求用于测试
export async function GET() {
  return NextResponse.json({
    message: '模拟登录API',
    instructions: '发送POST请求登录账户（无需Supabase环境变量）',
    example: {
      phone: '13800138001',
      password: '123456'
    },
    note: '无需配置环境变量，数据存储在内存中',
    test_users: Array.from(mockUsers.keys())
  })
}