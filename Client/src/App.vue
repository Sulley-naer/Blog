<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import { registeredCaptcha } from '@/utils/apis/public'
import { Login, Registered } from '@/utils/apis/user'

//TODO 把你的请求放该放的位置去

//发送验证码
// const captcha = async () => {
//     const { data, error, loading, refetch } = await registeredCaptcha("suileyansc@2925.com")
//     console.log(refetch().then(res => {
//         console.log("res", res)
//     }))
// }
// captcha()

//注册
const register = async () => {
  const { data, error, loading, refetch } = Registered('aaaa', 'ws', 'suileyansc@2925.com', '6668')
  console.log(
    refetch().then((res) => {
      console.log('res', res)
    }),
  )
}

register()

//登录
// const Login = async () => {
//     const { data, error, loading, refetch } = await Login("zs", "zs")
//     console.log(refetch().then(res => {
//         console.log("res", res)
//     }).catch(err => {
//         console.error("Error:", err)
//     }))
// }
// Login()

console.log('路由跳转', isRouting.value)
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style scoped></style>
