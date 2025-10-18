// Vercel API 路由 - 处理 n8n 回调
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('收到 n8n 回调:', req.body);
      
      // 这里可以添加你的回调处理逻辑
      // 比如存储到数据库、发送通知等
      
      res.status(200).json({ 
        success: true, 
        message: '回调处理成功',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('回调处理失败:', error);
      res.status(500).json({ 
        success: false, 
        message: '回调处理失败',
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
