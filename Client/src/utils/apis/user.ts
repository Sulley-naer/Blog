import { useLazyFetch } from '@/utils/useFetch'

export const Login = (userName: string,password:string) => {
  if (!userName&&!password) {
    throw new Error('用户名或密码不能为空')
  }
  return useLazyFetch('/login', {
    method: 'POST',
    body: {
      name: userName,
      pwd: password,
    },
  })
}

export const Registered = (userName: string, password: string, email: string, captcha: string) => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!userName && !password) {
    throw new Error('用户名或密码不能为空')
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('邮箱格式不正确')
  }
  if (!captcha) {
    throw new Error('验证码不能为空')
  }

  const formData = new FormData()
  formData.append('name', userName)
  formData.append('pwd', password)
  formData.append('email', email)
  formData.append('captcha', captcha)

  return useLazyFetch('/registered', {
    method: 'POST',
    body: formData,
  })
}
