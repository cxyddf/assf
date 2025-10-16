# Supabase 集成指南

## 项目已成功集成 Supabase

### 配置信息
- **Supabase URL**: `https://suivywztcgbkradyymqh.supabase.co`
- **API Key**: 已配置在环境变量中

### 新增文件
1. `src/services/supabase.ts` - Supabase客户端和服务方法
2. `src/types/supabase.ts` - Supabase相关类型定义
3. `.env` - 环境变量配置文件
4. `scripts/import-to-supabase.ts` - 数据导入脚本

### 主要功能
- ✅ Supabase客户端初始化
- ✅ 数据CRUD操作封装
- ✅ 实时订阅功能
- ✅ 错误处理和本地数据后备
- ✅ TypeScript类型支持

### 使用方法

#### 1. 在组件中使用
```typescript
import { supabase } from '@/services/supabase'
import { usePoetryStore } from '@/stores/poetry'

// 获取数据
const { data, error } = await supabase.from('poetry').select('*')

// 使用store（自动处理Supabase连接）
const poetryStore = usePoetryStore()
await poetryStore.loadPoems() // 会自动从Supabase加载数据
```

#### 2. 数据导入（可选）
如果需要将本地数据导入到Supabase：
```bash
npm run import-data
```

#### 3. 环境变量
项目已配置环境变量，确保以下文件存在：
- `.env` - 包含Supabase配置

### 数据库表结构建议
在Supabase中创建以下表：

#### poetry 表
```sql
CREATE TABLE poetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  content TEXT NOT NULL,
  translation TEXT,
  tags TEXT[],
  annotation TEXT,
  appreciation TEXT,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### authors 表
```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  description TEXT,
  works_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 注意事项
- 项目已配置本地数据后备，即使Supabase连接失败也能正常运行
- 所有数据库操作都有错误处理
- 支持实时数据订阅
- 类型安全，完整的TypeScript支持