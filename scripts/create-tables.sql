-- 诗词应用数据库表结构
-- 适用于Supabase PostgreSQL数据库

-- 1. 诗词表 (使用字符串ID与现有数据兼容)
CREATE TABLE IF NOT EXISTS poetry (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    annotation TEXT,
    appreciation TEXT,
    popularity INTEGER DEFAULT 0,
    translation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 作者表 (使用字符串ID与现有数据兼容)
CREATE TABLE IF NOT EXISTS authors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    dynasty VARCHAR(50) NOT NULL,
    description TEXT,
    works_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 用户收藏表 (新增)
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL, -- 用户ID，可以使用Supabase Auth的用户ID或临时用户标识
    poem_id VARCHAR(50) NOT NULL REFERENCES poetry(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 确保每个用户对同一首诗词只能收藏一次
    UNIQUE(user_id, poem_id)
);

-- 4. 搜索历史表 (可选)
CREATE TABLE IF NOT EXISTS search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    search_count INTEGER DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 每个用户对同一关键词的记录唯一
    UNIQUE(user_id, keyword)
);

-- 创建索引以提高查询性能

-- 诗词表索引
CREATE INDEX IF NOT EXISTS idx_poetry_author ON poetry(author);
CREATE INDEX IF NOT EXISTS idx_poetry_dynasty ON poetry(dynasty);
CREATE INDEX IF NOT EXISTS idx_poetry_popularity ON poetry(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_poetry_created_at ON poetry(created_at DESC);

-- 作者表索引
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_dynasty ON authors(dynasty);

-- 收藏表索引
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_id ON user_favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON user_favorites(created_at DESC);

-- 搜索历史索引
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_keyword ON search_history(keyword);
CREATE INDEX IF NOT EXISTS idx_search_history_last_searched ON search_history(last_searched DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE poetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略

-- 诗词表策略：所有人都可以读取
CREATE POLICY "允许所有人读取诗词" ON poetry
    FOR SELECT USING (true);

-- 作者表策略：所有人都可以读取
CREATE POLICY "允许所有人读取作者" ON authors
    FOR SELECT USING (true);

-- 收藏表策略：用户只能管理自己的收藏
CREATE POLICY "用户管理自己的收藏" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- 搜索历史策略：用户只能管理自己的搜索历史
CREATE POLICY "用户管理自己的搜索历史" ON search_history
    FOR ALL USING (auth.uid() = user_id);

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要updated_at字段的表添加触发器
CREATE TRIGGER update_poetry_updated_at 
    BEFORE UPDATE ON poetry 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建用于收藏功能的视图（注释掉，因为poetry表没有poem_id字段）
-- CREATE OR REPLACE VIEW user_favorites_view AS
-- SELECT 
--     uf.id,
--     uf.user_id,
--     uf.poem_id,
--     uf.created_at,
--     p.title,
--     p.author,
--     p.dynasty,
--     p.content,
--     p.tags,
--     p.popularity
-- FROM user_favorites uf
-- JOIN poetry p ON uf.poem_id = p.id;

-- 注释
COMMENT ON TABLE poetry IS '存储诗词信息';
COMMENT ON TABLE authors IS '存储作者信息';
COMMENT ON TABLE user_favorites IS '存储用户收藏的诗词';
COMMENT ON TABLE search_history IS '存储用户搜索历史';

COMMENT ON COLUMN poetry.popularity IS '诗词热度评分，0-100';
COMMENT ON COLUMN user_favorites.user_id IS '关联Supabase Auth的用户ID';
COMMENT ON COLUMN search_history.search_count IS '该关键词被搜索的次数';

-- 插入示例数据（可选）- 注释掉，因为数据已通过导入脚本添加
-- INSERT INTO poetry (id, title, author, dynasty, content, tags, popularity) VALUES
-- ('1', '静夜思', '李白', '唐', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '{"思乡","月亮"}', 95),
-- ('2', '春晓', '孟浩然', '唐', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '{"春天","自然"}', 90)
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO authors (id, name, dynasty, description, works_count) VALUES
-- ('1', '李白', '唐', '唐代著名诗人，诗仙', 1000),
-- ('2', '孟浩然', '唐', '唐代山水田园诗人', 300)
-- ON CONFLICT (id) DO NOTHING;