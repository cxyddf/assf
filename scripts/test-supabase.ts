import { supabase } from '../src/services/supabase'

async function testConnection() {
  console.log('测试Supabase连接...')
  
  try {
    // 测试基本连接
    const { data, error } = await supabase.from('poetry').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase连接失败:', error.message)
      return false
    }
    
    console.log('✅ Supabase连接成功!')
    console.log('数据库表信息:')
    
    // 测试各个表的连接
    const tables = ['poetry', 'authors', 'user_favorites', 'search_history']
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (tableError) {
          console.log(`❌ ${table} 表不存在或无法访问`)
        } else {
          console.log(`✅ ${table} 表连接正常`)
        }
      } catch (err) {
        console.log(`❌ ${table} 表连接失败`)
      }
    }
    
    return true
  } catch (error) {
    console.error('连接测试异常:', error)
    return false
  }
}

// 运行测试
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase集成测试完成!')
  } else {
    console.log('\n⚠️  Supabase连接存在问题，请检查配置')
  }
})