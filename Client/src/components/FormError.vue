<template>
    <div class="form-error">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    message: string;
  }>();
  </script>
  
  <style scoped lang="scss">
  .form-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin-top: 0.5rem;
    background-color: rgba(229, 62, 62, 0.1); // 红色背景
    color: #e53e3e; // 红色文字
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  
    svg {
      flex-shrink: 0;
    }
  }
  </style>
