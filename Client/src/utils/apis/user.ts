import { useLazyFetch } from '@/utils/useFetch'

export const Login = (userName: string, password: string) => {
  if (!userName && !password) {
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

/*
@param {string} userName - 用户名
@param {string} password - 密码
@param {string} email - 邮箱
@param {string} captcha - 验证码
*/

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

  return useLazyFetch('/registered', {
    method: 'POST',
    body: {
      name: userName,
      pwd: password,
      email: email,
      captcha: captcha,
    },
  })
}
