<template>
  <ChatInterface />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatInterface from './components/ChatInterface.vue';

export default defineComponent({
  name: 'App',
  components: {
    ChatInterface
  }
});
</script>
