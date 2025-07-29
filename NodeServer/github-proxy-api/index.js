import express from 'express';
import os from 'os';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用 GitHub API 服务',
    version: '1.0.0'
  });
});

/**
 * 处理 GitHub API 请求的路由
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
app.post('/api/github-proxy', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: '缺少 URL 参数'
      });
    }
    
    if (!url.startsWith('https://api.github.com/')) {
      return res.status(400).json({
        success: false,
        message: '只允许访问 GitHub API'
      });
    }
    
    const options = {
      method: 'GET',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'PostmanRuntime-ApipostRuntime/1.1.0',
        Connection: 'keep-alive'
      }
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `GitHub API 请求失败: ${response.statusText}`
      });
    }
    
    const data = await response.json();
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('处理 GitHub 请求时出错:', error);
    res.status(500).json({
      success: false,
      message: '处理请求时发生错误',
      error: error.message
    });
  }
});

/**
 * 获取本地 IP 地址
 * @returns {string} 本地 IP 地址或 'localhost'
 */
function getLocalIP() {
  try {
    const interfaces = os.networkInterfaces();
    
    const ipv4Addresses = [];
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          if (iface.address.startsWith('192')) {
            return iface.address;
          }
          ipv4Addresses.push(iface.address);
        }
      }
    }
    
    const preferredIP = ipv4Addresses.find(ip => ip.startsWith('192'));
    if (preferredIP) {
      return preferredIP;
    }
    
    if (ipv4Addresses.length > 0) {
      return ipv4Addresses[0];
    }
    
    return 'localhost';
  } catch (error) {
    console.error('获取本地 IP 地址时出错:', error.message);
    return 'localhost';
  }
}

app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`GitHub API 服务器正在运行:`);
  console.log(`- 本地访问: http://localhost:${PORT}`);
  console.log(`- 网络访问: http://${localIP}:${PORT}`);
});

export default app;
