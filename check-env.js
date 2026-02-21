// 环境变量验证脚本
console.log('环境变量检查:');
console.log('1. Supabase 服务端变量:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '已设置' : '未设置');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '已设置' : '未设置');
console.log('2. Supabase 客户端变量:');
console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置');
console.log('3. Clerk 变量:');
console.log('   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '已设置' : '未设置');
console.log('   CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? '已设置' : '未设置');
console.log('   CLERK_API_URL:', process.env.CLERK_API_URL ? '已设置' : '未设置');
EOF && node check-env.js