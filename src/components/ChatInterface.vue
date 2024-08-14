<template>
  <div class="chat-container d-flex flex-column mx-auto">
    <div class="chat-window flex-grow-1 p-3 overflow-auto">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.from === 'player' ? 'player-message' : 'npc-message']">
        <div class="message-content p-2 rounded">
          <p>{{ message.text }}</p>
        </div>
      </div>
    </div>
    <div class="input-group mt-3">
      <input
        type="text"
        class="form-control"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
      />
      <button class="btn btn-primary" @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'ChatInterface',
  setup() {
    const state = reactive({
      messages: [
        { from: 'npc', text: 'Welcome to the game!' },
        { from: 'player', text: 'Thank you!' },
      ],
      newMessage: ''
    });

    const sendMessage = () => {
      if (state.newMessage.trim() !== '') {
        state.messages.push({ from: 'player', text: state.newMessage });
        state.newMessage = '';
        // Add NPC response logic here
        setTimeout(() => {
          state.messages.push({ from: 'npc', text: 'NPC response goes here.' });
        }, 1000);
      }
    };

    return {
      ...state,
      sendMessage
    };
  }
});
</script>

<style scoped>
.chat-container {
  height: 100vh;
  width: 100%;
}

.chat-window {
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.message {
  margin-bottom: 15px;
}

.player-message .message-content {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
}

.npc-message .message-content {
  background-color: #e9ecef;
  color: black;
  align-self: flex-start;
}

.message-content {
  max-width: 70%;
}

/* Media queries to handle width */
@media (min-width: 768px) {
  .chat-container {
    max-width: 768px;
  }
}
</style>
