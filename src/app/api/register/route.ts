import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 修改环境变量读取方式（支持服务端和客户端）
// NEXT_PUBLIC_前缀的变量在API路由中无法读取，需要添加服务端变量
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing-url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

// 添加调试日志确认变量读取
console.log('Supabase配置检查:');
console.log('URL来源:', process.env.SUPABASE_URL ? 'SUPABASE_URL' : process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL' : '未设置');
console.log('URL值:', supabaseUrl);
console.log('Key来源:', process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '未设置');
console.log('Key长度:', supabaseAnonKey?.length || 0);

export async function POST(req: Request) {
  try {
    console.log('注册API被调用');
    
    const { phone, password } = await req.json();

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

    // 创建Supabase客户端，添加详细配置
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
        }
      }
    });

    console.log('Supabase客户端创建成功');

    // 检查手机号是否已存在
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('查询用户错误:', queryError);
      return NextResponse.json(
        { success: false, error: '查询用户失败', details: queryError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该手机号已注册' },
        { status: 400 }
      );
    }

    // 创建用户
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        password_hash: passwordHash,
        nickname: `用户${phone.slice(-4)}`,
        plan: 'free'
      })
      .select()
      .single();

    if (createError) {
      console.error('创建用户错误:', createError);
      return NextResponse.json(
        { success: false, error: createError.message, details: createError },
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
      message: '注册成功',
    });
  } catch (error: any) {
    console.error('注册API异常:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}