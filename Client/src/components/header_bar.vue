<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
</script>
<template>
  <div class="header_bar">
    <div class="left_entry">1</div>
    <div class="center_entry">
      <div class="search_bar">
        <form class="search_from">
          <div class="ipt">
            <input type="text" autocomplete="off" placeholder="1234"/>
          </div>
          <div class="btn">
            <el-icon :size="10"><Search /></el-icon>
          </div>
        </form>
      </div>
    </div>
    <div class="right_entry">3</div>
  </div>
</template>
<style scoped lang="scss">
.header_bar {
  position: absolute;
  max-width: 2560px;
  width: 100%;
  height: 64px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  inset: 0;
  z-index: 999;
  .center_entry {
    margin: auto;
    width: 30%;
    height: 100%;
    .search_bar {
      height: 100%;
      padding: 5px;
      border-radius: 5px;
      background-color: rgba($color: #e2e2e2, $alpha: 0.9);
      .search_from {
        min-width: 181px;
        height: 100%;
        display: flex;
        .ipt {
          padding: 0 8px;
          width: 100%;
          height: 100%;

          input {
            width: 100%;
            height: 100%;
            background-color: transparent;
          }
        }
        .btn{
          width: 70px;
          background-color: red;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
