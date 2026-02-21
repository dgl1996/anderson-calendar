import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 修改环境变量读取方式（支持服务端和客户端）
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing-url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

console.log('数据库初始化API配置检查:');
console.log('URL来源:', process.env.SUPABASE_URL ? 'SUPABASE_URL' : process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL' : '未设置');
console.log('Key来源:', process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '未设置');

export async function POST() {
  try {
    console.log('数据库初始化API被调用');
    
    // 创建Supabase客户端
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

    // 简单测试连接 - 查询users表是否存在
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('数据库连接测试失败:', error);
      return NextResponse.json({ 
        success: false, 
        error: '数据库表可能不存在，请手动创建',
        details: error.message 
      }, { status: 500 });
    }

    console.log('数据库连接测试成功');
    
    return NextResponse.json({ 
      success: true, 
      message: '数据库连接正常，表已存在',
      data: { connected: true }
    });
  } catch (error: any) {
    console.error('数据库初始化错误:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '数据库连接测试API',
    instructions: '发送 POST 请求测试数据库连接',
    note: '假设数据库表已手动创建，仅测试连接状态'
  });
}