<template>
    <div ref="container" class="demo-wrapper">
        <div v-if="loading" class="loader df aic jcc">
            <div>
                <h1>Loading</h1>
                <h2 class="loader--text">{{ progress }}%</h2>
            </div>
        </div>
        <div v-else>
            <header class="df aic jcc">
                <h1>abc</h1>
                <h2>abc</h2>
            </header>

            <!-- 第一行文字 -->
            <section class="demo-text">
                <div ref="first" class="wrapper text">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            </section>

            <!-- 图片区 -->
            <section class="demo-gallery">
                <ul ref="gallery" class="wrapper">
                    <li v-for="(img, i) in images" :key="i"><img :src="img" /></li>
                </ul>
            </section>

            <!-- 第二行文字 -->
            <section class="demo-text last">
                <div ref="second" class="wrapper text">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            </section>

            <footer class="df aic jcc">
                <p>abc</p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import imagesLoaded from 'imagesloaded'

const loading = ref(true)
const progress = ref(0)
const images = Array.from({ length: 12 }, () => 'https://www.dmoe.cc/random.php')

const container = ref<HTMLElement>()
const first = ref<HTMLElement>()
const second = ref<HTMLElement>()
const gallery = ref<HTMLElement>()

function calcProg(rectTop: number, vh: number) {
    const start = vh, end = vh * 0.2
    if (rectTop <= start && rectTop >= end) return 1 - (rectTop - end) / (start - end)
    if (rectTop < end) return 1
    return 0
}

function onScroll() {
    const vh = window.innerHeight

    if (first.value) {
        const sec = first.value.parentElement!
        const r = sec.getBoundingClientRect()
        const prog = calcProg(r.top, vh)
        const cw = r.width, w = first.value.scrollWidth
        const startX = -w + cw - 2000 // 调整初始位置为 -2000
        const endX = 0
        first.value.style.transform = `translateX(${startX + (endX - startX) * prog}px)`
    }

    if (gallery.value) {
        Array.from(gallery.value.children).forEach((li, i) => {
            const r = (li as HTMLElement).getBoundingClientRect()
            const prog = calcProg(r.top, vh)
            const dir = Math.floor(i / 4) % 2 === 0 ? -1 : 1
                ; (li as HTMLElement).style.transform = `translateX(${dir * (1 - prog) * 100}%)`
        })
    }

    if (second.value) {
        const sec = second.value.parentElement!
        const r = sec.getBoundingClientRect()
        const prog = calcProg(r.top, vh)
        const cw = r.width, w = second.value.scrollWidth
        const startX = cw
        const endX = cw - w
        second.value.style.transform = `translateX(${startX + (endX - startX) * prog}px)`
    }
}

let scrollHandler: EventListener
onMounted(async () => {
    await nextTick()
    const imgs = container.value!.querySelectorAll('img')

    // 设置scroll容器
    container.value!.style.height = '100vh'
    container.value!.style.overflowY = 'auto'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    scrollHandler = () => requestAnimationFrame(onScroll)

    imagesLoaded(imgs)
        .on('progress', inst => { progress.value = Math.round(inst.progressedCount * 100 / imgs.length) })
        .on('always', () => {
            loading.value = false
            container.value?.addEventListener('scroll', scrollHandler)

            // 初始化：第一行文字从左侧滑入，第二行文字全右侧
            onScroll()
        })
})

onUnmounted(() => {
    container.value?.removeEventListener('scroll', scrollHandler)
})
</script>

<style scoped lang="scss">
.df {
    display: flex
}

.aic {
    align-items: center
}

.jcc {
    justify-content: center
}

.loader {
    position: fixed;
    inset: 0;
    background: black;
    color: white;
    z-index: 999;
    transition: opacity .5s;

    &.fade {
        opacity: 0;
        pointer-events: none;
    }
}

.loader--text {
    font-size: 2rem
}

.demo-wrapper {
    overflow-x: hidden
}

header {
    height: 100vh;
    margin-bottom: 2rem
}

footer {
    height: 50vh
}

.wrapper {
    display: inline-flex;
    white-space: nowrap;
    overflow: visible;
    will-change: transform;
}

.text {
    font-size: clamp(8rem, 15vw, 16rem);
    font-weight: 900;
}

.demo-gallery {
    padding: 2rem;

    ul.wrapper {
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
}

li {
    flex: 0 0 calc((100% - 3rem)/4);
    height: 300px;
    overflow: hidden;
    will-change: transform;
    transition: transform .2s ease-out;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
