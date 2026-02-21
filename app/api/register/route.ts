import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 服务端环境变量
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    console.log('🔍 注册API调用开始')
    console.log('环境变量状态:')
    console.log('SUPABASE_URL存在:', !!supabaseUrl)
    console.log('SUPABASE_ANON_KEY存在:', !!supabaseAnonKey)

    // 验证环境变量
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ 环境变量缺失')
      return NextResponse.json(
        {
          success: false,
          error: '服务器配置错误，请联系管理员',
          details: '缺少数据库连接信息'
        },
        { status: 500 }
      )
    }

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

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase客户端创建成功')

    // 检查手机号是否已存在
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle()

    if (queryError) {
      console.error('❌ 查询用户失败:', queryError)
      return NextResponse.json(
        {
          success: false,
          error: '数据库查询失败，请稍后重试'
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      console.log('❌ 手机号已存在:', phone)
      return NextResponse.json(
        {
          success: false,
          error: '该手机号已注册'
        },
        { status: 400 }
      )
    }

    // 创建新用户
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        password_hash: password, // 简化：先明文存储
        nickname: `用户${phone.slice(-4)}`,
        plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ 创建用户失败:', createError)
      return NextResponse.json(
        {
          success: false,
          error: createError.message,
          details: createError
        },
        { status: 500 }
      )
    }

    console.log('✅ 用户注册成功:', newUser.id)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        nickname: newUser.nickname,
        plan: newUser.plan
      },
      message: '注册成功'
    })
  } catch (error: any) {
    console.error('❌ 注册API异常:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '服务器内部错误',
        details: error
      },
      { status: 500 }
    )
  }
}

// 支持GET请求用于测试
export async function GET() {
  return NextResponse.json({
    message: '注册API',
    instructions: '发送POST请求注册新用户',
    example: {
      phone: '13800138000',
      password: '123456'
    },
    note: '确保配置了正确的Supabase环境变量'
  })
}