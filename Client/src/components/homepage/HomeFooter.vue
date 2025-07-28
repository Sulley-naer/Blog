<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img class="w-[40px] h-[40px]" src="@/assets/images/logo/logo_T.png" alt="" />
            <span>SuiKnit</span>
          </div>
          <p class="footer-description">
            SuiKnit 是您的智能笔记平台，让知识的收集、整理和分享变得前所未有的简单。
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-weibo"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3>产品</h3>
          <ul class="footer-links">
            <li><a href="#features">功能特性</a></li>
            <li><a href="#pricing">价格方案</a></li>
            <li><a href="#api">API 文档</a></li>
            <li><a href="#integrations">集成</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>支持</h3>
          <ul class="footer-links">
            <li><a href="#help">帮助中心</a></li>
            <li><a href="#tutorials">使用教程</a></li>
            <li><a href="#faq">常见问题</a></li>
            <li><a href="#contact">联系我们</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>公司</h3>
          <ul class="footer-links">
            <li><a href="#about">关于我们</a></li>
            <li><a href="#careers">招聘信息</a></li>
            <li><a href="#blog">博客</a></li>
            <li><a href="#press">新闻</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>法律</h3>
          <ul class="footer-links">
            <li><a href="#privacy">隐私政策</a></li>
            <li><a href="#terms">服务条款</a></li>
            <li><a href="#cookies">Cookie 政策</a></li>
            <li><a href="#security">安全</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 SuiKnit. 保留所有权利。</p>
          <div class="footer-bottom-links">
            <a href="#privacy">隐私</a>
            <a href="#terms">条款</a>
            <a href="#cookies">Cookie</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped lang="scss">
.footer {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 60px 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
  }

  .footer-description {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  h3 {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .footer-links {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 12px;

      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }
      }
    }
  }

  .social-links {
    display: flex;
    gap: 15px;

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transform: translateY(-2px);
      }

      i {
        font-size: 1rem;
      }
    }
  }
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;

  .footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }

    .footer-bottom-links {
      display: flex;
      gap: 20px;

      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
