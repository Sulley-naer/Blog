<template>
  <section class="contact" id="contact">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">联系我们</h2>
        <p class="section-subtitle">有任何问题或建议？我们随时为您服务</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">
              <img src="@/assets/images/homeIcon/email.png" alt="">
            </div>
            <div class="contact-details">
              <h3>邮箱</h3>
              <p>suileyan@foxmail.com</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">
              <img src="@/assets/images/homeIcon/phone.png" alt="">
            </div>
            <div class="contact-details">
              <h3>电话</h3>
              <p>+86 400-123-4567</p>
            </div>
          </div>

          <div class="social-links">
            <h3>关注我们</h3>
            <div class="social-icons">
              <a href="https://github.com/suileyan" target="_blank" class="social-icon">
                <img src="@/assets/images/homeIcon/suileyan.jpg" alt="suileyan">
              </a>
              <a href="https://github.com/Sulley-naer" target="_blank" class="social-icon">
                <img src="@/assets/images/homeIcon/knitting.png" alt="knitting">
              </a>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">姓名</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="请输入您的姓名"
              />
            </div>

            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="请输入您的邮箱"
              />
            </div>

            <div class="form-group">
              <label for="subject">主题</label>
              <input
                type="text"
                id="subject"
                v-model="formData.subject"
                required
                placeholder="请输入主题"
              />
            </div>

            <div class="form-group">
              <label for="message">内容</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="5"
                placeholder="请输入内容"
              ></textarea>
            </div>

            <RippleButton type="submit" variant="primary">
              <i class="fas fa-paper-plane"></i>
              发送消息
            </RippleButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import RippleButton from '@/components/ui/RippleButton.vue'

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = () => {
  console.log('Form submitted:', formData)
  // 这里可以添加表单提交逻辑
  alert('消息已发送！我们会尽快回复您。')

  // 重置表单
  formData.name = ''
  formData.email = ''
  formData.subject = ''
  formData.message = ''
}
</script>

<style scoped lang="scss">
.contact {
  padding: 40px 0 0 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.contact-info {
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    .contact-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
    }

    .contact-details {
      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: white;
        margin-bottom: 8px;
      }

      p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
      }
    }
  }
}

.social-links {
  margin-top: 40px;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 20px;
  }

  .social-icons {
    display: flex;
    gap: 15px;

    .social-icon {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-3px);
      }
    }
  }
}

.contact-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;

  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      color: white;
      font-weight: 600;
      margin-bottom: 8px;
    }

    input,
    textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
        border-color: #4ecdc4;
        background: rgba(255, 255, 255, 0.15);
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .section-title {
    font-size: 2rem;
  }

  .contact-form {
    padding: 30px 20px;
  }
}
</style>
