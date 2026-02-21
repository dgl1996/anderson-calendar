import { NextResponse } from 'next/server'

// 模拟用户数据库（内存存储）
const mockUsers = new Map<string, any>()

export async function POST(request: Request) {
  try {
    console.log('🔍 模拟注册API调用（无需Supabase）')
    
    // 解析请求体
    const body = await request.json()
    const { phone, password } = body

    console.log('📱 注册信息:', { phone, passwordLength: password?.length })

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

    if (phone.length < 11) {
      return NextResponse.json(
        {
          success: false,
          error: '请输入有效的11位手机号'
        },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: '密码长度不能少于6位'
        },
        { status: 400 }
      )
    }

    // 检查手机号是否已存在
    if (mockUsers.has(phone)) {
      console.log('❌ 手机号已存在:', phone)
      return NextResponse.json(
        {
          success: false,
          error: '该手机号已注册'
        },
        { status: 400 }
      )
    }

    // 创建模拟用户
    const mockUser = {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phone,
      password_hash: password, // 简化：明文存储
      nickname: `用户${phone.slice(-4)}`,
      plan: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockUsers.set(phone, mockUser)
    
    console.log('✅ 模拟用户注册成功:', mockUser.id)
    console.log('📊 当前模拟用户数量:', mockUsers.size)

    return NextResponse.json({
      success: true,
      user: {
        id: mockUser.id,
        phone: mockUser.phone,
        nickname: mockUser.nickname,
        plan: mockUser.plan
      },
      message: '注册成功（模拟模式）',
      note: '此为模拟注册，数据仅存储在内存中'
    })
  } catch (error: any) {
    console.error('❌ 模拟注册API异常:', error)
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
    message: '模拟注册API',
    instructions: '发送POST请求注册新用户（无需Supabase环境变量）',
    example: {
      phone: '13800138000',
      password: '123456'
    },
    note: '无需配置环境变量，数据存储在内存中',
    current_users: mockUsers.size
  })
}