<template>
  <div class="waiting-dots">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style scoped>
.waiting-dots {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  height: 20px;
  padding-left: 1rem;
}

.waiting-dots div {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background-color: #888;
  border-radius: 50%;
  animation: waitingBounce 1.4s infinite both;
}

.waiting-dots div:nth-child(1) {
  animation-delay: -0.32s;
}

.waiting-dots div:nth-child(2) {
  animation-delay: -0.16s;
}

.waiting-dots div:nth-child(3) {
  animation-delay: 0s;
}

@keyframes waitingBounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
