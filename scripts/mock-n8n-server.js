// 模拟n8n服务器，用于测试诗词分析功能
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5678;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 模拟AI分析函数
function analyzePoetryWithAI(poetry) {
  console.log('🤖 AI开始分析诗词:', poetry);
  
  // 模拟不同的诗词分析结果
  const analysisResults = {
    '床前明月光，疑是地上霜。举头望明月，低头思故乡。': {
      translation: '床前明亮的月光，好像地上铺了一层霜。抬起头望着天上的明月，低下头思念故乡。',
      theme: '思乡之情，月夜怀远',
      artistic_features: '运用对比手法，通过月光与霜的比喻，营造出清冷孤寂的意境。语言简洁明快，意境深远。',
      historical_context: '唐代诗人李白创作，反映了游子思乡的普遍情感。',
      author_insights: '李白通过简单的场景描写，深刻表达了游子对故乡的深切思念。',
      appreciation: '这首诗语言质朴，意境深远，通过月夜思乡的场景，表达了人类共通的情感，成为千古传诵的名篇。'
    },
    '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。': {
      translation: '春夜酣睡不知不觉天已破晓，到处都能听到鸟儿的啼叫声。回想昨夜的风雨声，不知花儿被打落了多少。',
      theme: '惜春之情，对自然美景的欣赏',
      artistic_features: '运用听觉描写，通过鸟鸣和风雨声营造春意盎然的意境。语言清新自然。',
      historical_context: '唐代诗人孟浩然创作，描绘春日清晨的美好景象。',
      author_insights: '孟浩然通过对春日清晨的细腻描写，表达了对大自然的热爱和珍惜时光的情感。',
      appreciation: '这首诗语言清新，意境优美，通过对春日清晨的描写，展现了诗人对自然美景的敏锐感受。'
    },
    '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。': {
      translation: '夕阳依傍着西山慢慢沉落，滔滔黄河朝着东海汹涌奔流。想要看到千里之外的风光，那就要再登上更高的一层城楼。',
      theme: '登高望远，积极进取',
      artistic_features: '运用对仗工整的句式，通过壮丽的自然景观表达人生哲理。',
      historical_context: '唐代诗人王之涣创作，体现了盛唐时期积极向上的精神风貌。',
      author_insights: '王之涣通过登高望远的场景，表达了不断进取、追求更高境界的人生态度。',
      appreciation: '这首诗气势磅礴，哲理深刻，成为鼓励人们积极向上的经典名句。'
    }
  };
  
  // 返回对应的分析结果或默认分析
  if (analysisResults[poetry]) {
    return analysisResults[poetry];
  }
  
  // 默认分析模板
  return {
    translation: `对"${poetry}"的现代汉语翻译。`,
    theme: '诗词的主题思想分析',
    artistic_features: '诗词的艺术特色和修辞手法分析',
    historical_context: '诗词创作的历史背景和文化语境',
    author_insights: '作者的创作意图和情感表达',
    appreciation: '对诗词的整体赏析和评价'
  };
}

// Webhook端点 - 诗词分析
app.post('/webhook/api/poetry-analysis', (req, res) => {
  console.log('📨 收到诗词分析请求:', req.body);
  
  const { poetry, options } = req.body;
  
  if (!poetry || poetry.trim() === '') {
    return res.status(400).json({
      success: false,
      error: '请提供有效的诗词内容',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    // 模拟处理时间
    setTimeout(() => {
      const analysisResult = analyzePoetryWithAI(poetry.trim());
      
      const response = {
        success: true,
        data: analysisResult,
        timestamp: new Date().toISOString(),
        metadata: {
          poetry_length: poetry.length,
          analysis_complete: true,
          ai_model: 'deepseek-chat'
        }
      };
      
      console.log('✅ 返回完整的诗词分析结果');
      res.json(response);
      
    }, 2000); // 模拟2秒处理时间
    
  } catch (error) {
    console.error('❌ 分析过程中出现错误:', error);
    res.status(500).json({
      success: false,
      error: '诗词分析失败: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mock-n8n-server',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 模拟n8n服务器运行在 http://localhost:${PORT}`);
  console.log('📊 可用端点:');
  console.log('  POST /webhook/api/poetry-analysis - 诗词分析');
  console.log('  GET  /health - 健康检查');
  console.log('');
  console.log('💡 测试命令:');
  console.log('  curl -X POST http://localhost:5678/webhook/api/poetry-analysis \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"poetry":"床前明月光，疑是地上霜。举头望明月，低头思故乡。"}\'');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\\n🛑 正在关闭服务器...');
  process.exit(0);
});