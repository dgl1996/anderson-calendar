import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 服务端环境变量（必须使用非NEXT_PUBLIC前缀）
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    // 验证环境变量
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('环境变量缺失:', { urlExists: !!supabaseUrl, keyExists: !!supabaseAnonKey });
      return NextResponse.json(
        { success: false, error: '服务器配置错误：缺少数据库连接信息' },
        { status: 500 }
      );
    }

    const { phone, password } = await req.json();

    // 验证输入
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: '手机号和密码不能为空' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度不能少于6位' },
        { status: 400 }
      );
    }

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 检查手机号是否已存在
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (queryError) {
      console.error('查询用户失败:', queryError);
      return NextResponse.json(
        { success: false, error: '数据库查询失败' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该手机号已注册' },
        { status: 400 }
      );
    }

    // 创建新用户（简化版，先验证流程）
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        password_hash: password, // 先明文存储，验证成功后再加密
        nickname: `用户${phone.slice(-4)}`,
        plan: 'free'
      })
      .select()
      .single();

    if (createError) {
      console.error('创建用户失败:', createError);
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      );
    }

    console.log('用户注册成功:', newUser.id);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        nickname: newUser.nickname
      },
      message: '注册成功'
    });
  } catch (error: any) {
    console.error('注册API异常:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}