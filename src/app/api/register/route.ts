import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 直接从环境变量读取，添加详细的调试信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing-url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

console.log('Supabase配置检查:');
console.log('URL配置:', supabaseUrl ? '已设置' : '未设置');
console.log('URL长度:', supabaseUrl?.length || 0);
console.log('Key配置:', supabaseAnonKey ? '已设置' : '未设置');
console.log('Key长度:', supabaseAnonKey?.length || 0);

// 修正后的SQL - 独立表，不依赖auth.users
const initSQL = `
-- 创建独立的 users 表（不依赖 auth.users）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  plan VARCHAR(20) DEFAULT 'free' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Edge Function can manage users" ON public.users;
CREATE POLICY "Edge Function can manage users" ON public.users 
  FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);

-- 创建 activation_codes 表
CREATE TABLE IF NOT EXISTS public.activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  batch_name VARCHAR(50),
  plan VARCHAR(20) DEFAULT 'pro',
  status VARCHAR(20) DEFAULT 'unused',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT
);

ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage activation codes" ON public.activation_codes;
CREATE POLICY "Admins can manage activation codes" ON public.activation_codes 
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Edge Function can manage activation codes" ON public.activation_codes;
CREATE POLICY "Edge Function can manage activation codes" ON public.activation_codes 
  FOR ALL WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON public.activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON public.activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_batch ON public.activation_codes(batch_name);
`;

async function initDatabase() {
  try {
    console.log('初始化数据库，URL:', supabaseUrl);
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql: initSQL })
    });
    
    console.log('数据库初始化响应状态:', response.status);
    console.log('数据库初始化响应状态文本:', response.statusText);
    
    return response.ok;
  } catch (error: any) {
    console.error('数据库初始化错误:', error.message);
    return false;
  }
}

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

    const initSuccess = await initDatabase();
    console.log('数据库初始化结果:', initSuccess ? '成功' : '失败');

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