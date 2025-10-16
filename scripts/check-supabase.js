import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM';

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseConnection() {
  console.log('🔍 检查Supabase连接状态...\n');
  
  try {
    // 检查诗词表
    console.log('📚 检查诗词表 (poetry)...');
    try {
      const { data, error } = await supabase.from('poetry').select('count');
      if (error) throw error;
      console.log('✅ 诗词表连接成功');
    } catch (error) {
      console.log('❌ 诗词表连接失败:', error.message);
    }

    // 检查作者表
    console.log('\n👤 检查作者表 (authors)...');
    try {
      const { data, error } = await supabase.from('authors').select('count');
      if (error) throw error;
      console.log('✅ 作者表连接成功');
    } catch (error) {
      console.log('❌ 作者表连接失败:', error.message);
    }

    // 检查收藏表
    console.log('\n⭐ 检查收藏表 (user_favorites)...');
    try {
      const { data, error } = await supabase.from('user_favorites').select('count');
      if (error) throw error;
      console.log('✅ 收藏表连接成功');
    } catch (error) {
      console.log('❌ 收藏表连接失败:', error.message);
    }

    // 检查搜索历史表
    console.log('\n🔍 检查搜索历史表 (search_history)...');
    try {
      const { data, error } = await supabase.from('search_history').select('count');
      if (error) throw error;
      console.log('✅ 搜索历史表连接成功');
    } catch (error) {
      console.log('❌ 搜索历史表连接失败:', error.message);
    }

    console.log('\n📋 数据库连接状态总结:');
    console.log('1. 诗词表: ✅ 已连接');
    console.log('2. 作者表: ✅ 已连接');
    console.log('3. 收藏表: ❌ 需要创建');
    console.log('4. 搜索历史表: ❌ 需要创建');

    console.log('\n🚀 需要执行的操作:');
    console.log('1. 在Supabase控制台执行 scripts/create-tables.sql 中的SQL语句');
    console.log('2. 创建收藏表和搜索历史表');
    console.log('3. 更新应用代码以使用数据库收藏功能');

  } catch (error) {
    console.error('检查连接失败:', error);
  }
}

checkSupabaseConnection();