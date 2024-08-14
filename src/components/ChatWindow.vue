<template>
  <div class="chat-container">
    <div class="chat-box">
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
    </div>
    <div class="input-box">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        class="input"
        placeholder="Type a message..."
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const messages = ref([
      { id: 1, sender: 'bot', text: 'Hello! How can I help you today?', timestamp: new Date() },
    ]);
    const newMessage = ref('');

    const sendMessage = () => {
      if (newMessage.value.trim() !== '') {
        messages.value.push({
          id: Date.now(),
          sender: 'user',
          text: newMessage.value.trim(),
          timestamp: new Date(),
        });
        newMessage.value = '';

        // 模拟机器人回复
        setTimeout(() => {
          messages.value.push({
            id: Date.now(),
            sender: 'bot',
            text: 'This is a bot response.',
            timestamp: new Date(),
          });
        }, 1000);
      }
    };

    const formatTimestamp = (timestamp: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return timestamp.toLocaleDateString(undefined, options);
    };

    return {
      messages,
      newMessage,
      sendMessage,
      formatTimestamp,
    };
  },
});
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.messages {
  display: flex;
  flex-direction: column;
}

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
