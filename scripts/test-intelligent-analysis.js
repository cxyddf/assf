// 测试智能分析功能
const testPoems = [
  {
    title: "静夜思",
    content: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    expectedMood: "nostalgic",
    expectedImagery: ["月亮"]
  },
  {
    title: "春晓",
    content: "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
    expectedMood: "contemplative",
    expectedImagery: ["鸟类", "风", "雨", "花朵"]
  },
  {
    title: "登鹳雀楼",
    content: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
    expectedMood: "contemplative",
    expectedImagery: ["山峦", "流水"]
  },
  {
    title: "忧愁诗",
    content: "愁云惨淡万里凝，忧心如焚夜难眠。泪眼朦胧看世界，心中苦闷无人知。",
    expectedMood: "melancholy",
    expectedImagery: ["风", "雨"]
  },
  {
    title: "欢乐诗",
    content: "春风得意马蹄疾，一日看尽长安花。欢声笑语满庭院，喜气洋洋庆佳节。",
    expectedMood: "joyful",
    expectedImagery: ["风", "花朵"]
  }
];

// 模拟智能分析功能
function analyzePoetryContent(poetry) {
  const content = poetry.toLowerCase();
  const lines = poetry.split('\n').filter(line => line.trim());
  
  return {
    isClassic: isClassicPoetry(content),
    mood: detectMood(content),
    imagery: detectImagery(content),
    structure: analyzeStructure(lines),
    keywords: extractKeywords(content),
    lineCount: lines.length
  };
}

function isClassicPoetry(content) {
  const classicKeywords = ['明月', '故乡', '春风', '秋雨', '山水', '花鸟', '离别', '思念', '忧愁', '欢乐'];
  return classicKeywords.some(keyword => content.includes(keyword));
}

function detectMood(content) {
  if (content.includes('愁') || content.includes('忧') || content.includes('泪')) return 'melancholy';
  if (content.includes('喜') || content.includes('乐') || content.includes('欢')) return 'joyful';
  if (content.includes('思') || content.includes('念') || content.includes('忆')) return 'nostalgic';
  if (content.includes('山') || content.includes('水') || content.includes('自然')) return 'contemplative';
  return 'neutral';
}

function detectImagery(content) {
  const imagery = [];
  if (content.includes('月')) imagery.push('月亮');
  if (content.includes('花')) imagery.push('花朵');
  if (content.includes('鸟')) imagery.push('鸟类');
  if (content.includes('山')) imagery.push('山峦');
  if (content.includes('水')) imagery.push('流水');
  if (content.includes('风')) imagery.push('风');
  if (content.includes('雨')) imagery.push('雨');
  return imagery;
}

function analyzeStructure(lines) {
  if (lines.length === 4) return '绝句';
  if (lines.length === 8) return '律诗';
  if (lines.length === 2) return '对联';
  return '自由体';
}

function extractKeywords(content) {
  const keywords = [];
  if (content.includes('明月')) keywords.push('明月');
  if (content.includes('故乡')) keywords.push('故乡');
  if (content.includes('春风')) keywords.push('春风');
  if (content.includes('秋雨')) keywords.push('秋雨');
  return keywords;
}

function generateTranslation(firstLine, analysis) {
  const moodMap = {
    melancholy: '这首诗词流露出淡淡的忧愁',
    joyful: '这首诗词洋溢着欢快的情感',
    nostalgic: '这首诗词充满了深切的思念',
    contemplative: '这首诗词体现了对自然的深刻感悟',
    neutral: '这首诗词表达了'
  };
  
  return `${moodMap[analysis.mood] || '这首诗词表达了'}，以"${firstLine}"开篇，通过${analysis.imagery.join('、')}等意象，营造出${getMoodDescription(analysis.mood)}的意境。`;
}

function getMoodDescription(mood) {
  const descriptions = {
    melancholy: '忧愁深沉',
    joyful: '欢快明朗',
    nostalgic: '思念深切',
    contemplative: '沉思深远',
    neutral: '意境优美'
  };
  
  return descriptions[mood] || descriptions.neutral;
}

async function testIntelligentAnalysis() {
  console.log('🔍 测试智能分析功能...');
  
  for (let i = 0; i < testPoems.length; i++) {
    const poem = testPoems[i];
    console.log(`\n📝 测试诗词 ${i + 1}: ${poem.title}`);
    console.log(`📄 内容: ${poem.content}`);
    
    const analysis = analyzePoetryContent(poem.content);
    console.log('🔍 分析结果:');
    console.log(`  情感基调: ${analysis.mood}`);
    console.log(`  意象: ${analysis.imagery.join('、')}`);
    console.log(`  结构: ${analysis.structure}`);
    console.log(`  关键词: ${analysis.keywords.join('、')}`);
    console.log(`  行数: ${analysis.lineCount}`);
    
    const firstLine = poem.content.split('\n')[0];
    const translation = generateTranslation(firstLine, analysis);
    console.log(`📖 翻译: ${translation}`);
    
    // 验证分析结果
    const moodMatch = analysis.mood === poem.expectedMood;
    const imageryMatch = poem.expectedImagery.every(img => analysis.imagery.includes(img));
    
    console.log(`✅ 情感基调匹配: ${moodMatch ? '✓' : '✗'}`);
    console.log(`✅ 意象匹配: ${imageryMatch ? '✓' : '✗'}`);
    
    if (moodMatch && imageryMatch) {
      console.log('🎉 分析结果准确！');
    } else {
      console.log('⚠️  分析结果需要调整');
    }
  }
  
  console.log('\n🎉 智能分析功能测试完成！');
}

// 运行测试
testIntelligentAnalysis()
  .then(() => {
    console.log('\n🎉 所有测试完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });

