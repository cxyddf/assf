import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 导出常用的Supabase方法
export const supabaseService = {
  // 获取数据
  async fetchData(table: string, query?: any) {
    const { data, error } = await supabase
      .from(table)
      .select(query || '*')
    
    if (error) throw error
    return data
  },

  // 插入数据
  async insertData(table: string, data: any) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    
    if (error) throw error
    return result
  },

  // 更新数据
  async updateData(table: string, id: string, data: any) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return result
  },

  // 删除数据 (支持按任意字段删除)
  async deleteData(table: string, condition: Record<string, any>) {
    let query = supabase.from(table).delete()
    
    // 构建查询条件
    for (const [key, value] of Object.entries(condition)) {
      query = query.eq(key, value)
    }
    
    const { error } = await query
    
    if (error) throw error
    return { success: true }
  },

  // 实时订阅
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel('table-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe()
  }
}

export default supabase