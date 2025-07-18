import { useLazyFetch } from "../useFetch.js"

export const registeredCaptcha = (email: string) => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('邮箱格式不正确，请输入有效的邮箱地址')
  }
  return useLazyFetch('/registered/captcha', {
    method: 'POST',
    body: { email },
  })
}
