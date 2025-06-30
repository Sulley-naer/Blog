<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import { registeredCaptcha } from "@/utils/apis/public"
import { Login, Registered } from "@/utils/apis/user"

//发送验证码
// const b = async () => {
//     const { data, error, loading, refetch } = await registeredCaptcha("suileyansc@2925.com")
//     console.log(refetch().then(res => {
//         console.log("res", res)
//     }))
// }
// b()

//注册
const a = async () => {
    const { data, error, loading, refetch } = await Registered("aaaa", "ws", "suileyansc@2925.com", "6668")
    console.log(refetch().then(res => {
        console.log("res", res)
    }))
}
a()
//登录
// const c = async () => {
//     const { data, error, loading, refetch } = await Login("zs", "zs")
//     console.log(refetch().then(res => {
//         console.log("res", res)
//     }).catch(err => {
//         console.error("Error:", err)
//     }))
// }
// c()

console.log("路由跳转", isRouting.value)
</script>

<template>
    <AppHeader />
    <RouterView />
</template>

<style scoped></style>
