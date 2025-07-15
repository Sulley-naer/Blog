<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
    const scrollEls = document.querySelectorAll('.scroll')

    scrollEls.forEach((el) => {
        gsap.to(el, {
            x: '-50%', 
            duration: 15, 
            repeat: -1,
            ease: 'linear'
        })
    })
})
</script>
    
    
<template>
    <div class="film">
        <div class="bar top">
            <div class="scroll"></div>
            <div class="scroll"></div>
        </div>
        <div class="bg">
            <div class="scroll"></div>
            <div class="scroll"></div>
        </div>
        <div class="bar bottom">
            <div class="scroll"></div>
            <div class="scroll"></div>
        </div>
    </div>
</template>
  
  
<style scoped lang="scss">
.film {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .bar,
    .bg {
        position: relative;
        overflow: hidden;
    }

    .bar {
        height: 15%;

        .scroll {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 200%;
            background-image: url('@/assets/images/film_bar.png');
            background-repeat: repeat-x;
            background-size: auto 100%;
            background-position: 0 0;
        }

        &.bottom .scroll {
            background-image: url('@/assets/images/film_bar.png');
        }
    }

    .bg {
        height: 70%;

        .scroll {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 200%;
            background-image: url('@/assets/images/film_bg.png');
            background-repeat: repeat-x;
            background-size: auto 100%;
            background-position: 0 0;
        }
    }
}
</style>
    
