import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        sql: `
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
`
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('初始化数据库失败:', error);
      return NextResponse.json({ 
        success: false, 
        error: '初始化数据库失败', 
        details: error 
      }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: '数据库初始化成功', 
      data 
    });
  } catch (error: any) {
    console.error('初始化数据库错误:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '使用 POST 方法初始化数据库',
    instructions: '发送 POST 请求到 /api/init-db 自动初始化数据库'
  });
}
EOF && echo "✅ 数据库初始化API文件创建完成"