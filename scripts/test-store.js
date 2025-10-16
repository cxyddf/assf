// 测试 store 状态
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { usePoetryStore } from '../src/stores/poetry.js'

const app = createApp({})
app.use(createPinia())

const store = usePoetryStore()

async function testStore() {
  console.log('测试 store 状态...')
  console.log('初始 poems 数量:', store.poems.length)
  console.log('初始 authors 数量:', store.authors.length)
  
  await store.loadPoems()
  console.log('加载后 poems 数量:', store.poems.length)
  
  await store.loadAuthors()
  console.log('加载后 authors 数量:', store.authors.length)
  
  console.log('dailyPoem:', store.dailyPoem)
  console.log('popularPoems 数量:', store.popularPoems.length)
}

testStore().catch(console.error)
