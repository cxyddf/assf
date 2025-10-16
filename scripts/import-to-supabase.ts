import { createClient } from '@supabase/supabase-js'
import poemsData from '../src/data/poems.json'
import authorsData from '../src/data/authors.json'

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 智能数据导入脚本
async function importData() {
  console.log('🚀 开始智能导入数据到Supabase...')

  try {
    let importedAuthors = 0
    let updatedAuthors = 0
    let importedPoems = 0
    let updatedPoems = 0

    // 导入作者数据
    console.log('\n👤 导入作者数据...')
    for (const author of authorsData) {
      const authorData = {
        id: author.id.toString(),
        name: author.name,
        dynasty: author.dynasty,
        description: author.description,
        works_count: author.poemCount
      }
      
      try {
        // 检查是否已存在
        const { data: existingAuthor } = await supabase
          .from('authors')
          .select('id')
          .eq('id', authorData.id)
          .single()

        if (existingAuthor) {
          // 更新现有数据
          await supabase
            .from('authors')
            .update(authorData)
            .eq('id', authorData.id)
          updatedAuthors++
          console.log(`✅ 更新作者: ${author.name}`)
        } else {
          // 插入新数据
          await supabase
            .from('authors')
            .insert(authorData)
          importedAuthors++
          console.log(`✅ 导入作者: ${author.name}`)
        }
      } catch (error) {
        console.log(`❌ 处理作者 ${author.name} 失败:`, error.message)
      }
    }

    // 导入诗词数据
    console.log('\n📚 导入诗词数据...')
    for (const poem of poemsData) {
      const poemData = {
        id: poem.id.toString(),
        title: poem.title,
        author: poem.author,
        dynasty: poem.dynasty,
        content: poem.content,
        tags: poem.tags || [],
        annotation: poem.annotation,
        appreciation: poem.appreciation,
        popularity: poem.popularity || 0
      }
      
      try {
        // 检查是否已存在
        const { data: existingPoem } = await supabase
          .from('poetry')
          .select('id')
          .eq('id', poemData.id)
          .single()

        if (existingPoem) {
          // 更新现有数据
          await supabase
            .from('poetry')
            .update(poemData)
            .eq('id', poemData.id)
          updatedPoems++
          console.log(`✅ 更新诗词: ${poem.title}`)
        } else {
          // 插入新数据
          await supabase
            .from('poetry')
            .insert(poemData)
          importedPoems++
          console.log(`✅ 导入诗词: ${poem.title}`)
        }
      } catch (error) {
        console.log(`❌ 处理诗词 ${poem.title} 失败:`, error.message)
      }
    }

    console.log('\n📊 导入统计:')
    console.log(`作者 - 新增: ${importedAuthors}, 更新: ${updatedAuthors}`)
    console.log(`诗词 - 新增: ${importedPoems}, 更新: ${updatedPoems}`)
    console.log('🎉 数据导入完成！')

  } catch (error) {
    console.error('❌ 数据导入失败:', error)
  }
}

// 运行导入
importData()