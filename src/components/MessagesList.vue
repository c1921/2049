<template>
  <div class="messages">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['chat-message', message.sender === 'user' ? 'is-user' : 'is-bot']"
    >
      <div class="chat-message-time">{{ formatTimestamp(message.timestamp) }}</div>
      <div class="chat-message-body">{{ message.text }}</div>
    </div>
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

<style scoped>
.chat-message {
  margin-bottom: 1rem;
}

.is-user {
  text-align: right;
}

.is-bot {
  text-align: left;
}

.chat-message-time {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.chat-message-body {
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background-color: #f5f5f5;
  max-width: 75%;
}

.is-user .chat-message-body {
  background-color: #48c774;
  color: white;
}
</style>
