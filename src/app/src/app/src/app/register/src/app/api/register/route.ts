import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

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

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 检查手机号是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该手机号已注册' },
        { status: 400 }
      );
    }

    // 使用 Supabase Auth 创建用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      phone: phone.startsWith('+') ? phone : `+86${phone}`,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    // 插入到 public.users 表
    const { error: insertError } = await supabase.from('users').insert({
      id: authData.user?.id,
      phone: phone,
      password_hash: 'managed_by_supabase_auth',
      plan: 'free',
    });

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '注册成功',
      userId: authData.user?.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}