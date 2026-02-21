import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 服务端环境变量
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    console.log('🔍 登录API调用开始')
    console.log('环境变量状态:')
    console.log('SUPABASE_URL存在:', !!supabaseUrl)
    console.log('SUPABASE_ANON_KEY存在:', !!supabaseAnonKey)

    // 验证环境变量
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ 环境变量缺失')
      return NextResponse.json(
        {
          success: false,
          error: '服务器配置错误，请联系管理员'
        },
        { status: 500 }
      )
    }

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

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase客户端创建成功')

    // 查询用户
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('password_hash', password) // 简化：直接匹配明文密码
      .single()

    if (queryError) {
      console.error('❌ 查询用户失败:', queryError)
      return NextResponse.json(
        {
          success: false,
          error: '手机号或密码错误'
        },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '手机号或密码错误'
        },
        { status: 401 }
      )
    }

    console.log('✅ 用户登录成功:', user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        plan: user.plan
      },
      message: '登录成功'
    })
  } catch (error: any) {
    console.error('❌ 登录API异常:', error)
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
    message: '登录API',
    instructions: '发送POST请求登录账户',
    example: {
      phone: '13800138000',
      password: '123456'
    },
    note: '确保配置了正确的Supabase环境变量'
  })
}