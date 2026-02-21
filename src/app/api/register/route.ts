import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 服务端环境变量
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    console.log('🔍 API注册请求开始');
    console.log('环境变量检查:');
    console.log('SUPABASE_URL存在:', !!supabaseUrl);
    console.log('SUPABASE_ANON_KEY存在:', !!supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ 环境变量缺失');
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
    console.log('✅ Supabase客户端创建成功');

    // 简化：直接创建用户
    const { data, error } = await supabase
      .from('users')
      .insert({
        phone,
        password_hash: password, // 暂时明文
        nickname: `用户${phone.slice(-4)}`,
        plan: 'free'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 创建用户失败:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ 用户注册成功:', data.id);
    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        phone: data.phone,
        nickname: data.nickname
      },
      message: '注册成功'
    });
  } catch (error: any) {
    console.error('❌ API异常:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}