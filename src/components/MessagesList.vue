<template>
  <div v-for="message in messages" :key="message.id"
    :class="['chat', message.sender === 'user' ? 'chat-sender' : 'chat-receiver']">
    <div class="chat-header text-base-content/50">{{ formatTimestamp(message.timestamp) }}</div>
    <div class="chat-bubble">{{ message.text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    messages: {
      type: Array as PropType<Array<{ id: number; sender: string; text: string; timestamp: Date }>>,
      required: true,
    },
  },
  methods: {
    formatTimestamp(timestamp: Date) {
      const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return timestamp.toLocaleDateString(undefined, options);
    },
  },
});
</script>