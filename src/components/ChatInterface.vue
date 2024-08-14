<template>
  <div class="chat-container d-flex flex-column mx-auto">
    <div class="chat-window flex-grow-1 p-3 overflow-auto">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.from === 'player' ? 'player-message d-flex justify-content-end' : 'npc-message', 'mb-3']">
        <div class="message-content p-2 rounded text-wrap">
          <small class="text-muted">{{ message.timestamp }}</small>
          <p class="mb-0">{{ message.text }}</p>
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
    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleString('en-US', options);
    };

    const state = reactive({
      messages: [
        { from: 'npc', text: 'Welcome to the game! How are you today?', timestamp: formatDate(new Date()) },
        { from: 'player', text: 'I’m doing well, thank you! What about you?', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'I’m just here to assist you with the game.', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'Do you need help with anything in particular?', timestamp: formatDate(new Date()) },
        { from: 'player', text: 'Yes, I’m curious about the game mechanics.', timestamp: formatDate(new Date()) },
        { from: 'player', text: 'Can you explain how battles work?', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'Sure! Battles are turn-based.', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'You and your opponent will take turns attacking based on your speed.', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'The damage you deal is calculated using your physical damage minus the opponent’s physical defense.', timestamp: formatDate(new Date()) },
        { from: 'player', text: 'Got it. And what happens when someone’s health reaches zero?', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'When your health reaches zero, you lose the battle.', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'If your opponent’s health reaches zero, you win and move on to the next challenge.', timestamp: formatDate(new Date()) },
        { from: 'player', text: 'Thanks for the explanation!', timestamp: formatDate(new Date()) },
        { from: 'npc', text: 'No problem! Feel free to ask if you have more questions.', timestamp: formatDate(new Date()) },
      ],
      newMessage: ''
    });

    const sendMessage = () => {
      if (state.newMessage.trim() !== '') {
        state.messages.push({ from: 'player', text: state.newMessage, timestamp: formatDate(new Date()) });
        state.newMessage = '';
        // Add NPC response logic here
        setTimeout(() => {
          const npcResponses = [
            'Sure, let me explain more about that.',
            'That’s a good question!',
            'I can help you with that, no problem.',
            'Is there anything else you would like to know?',
            'I hope that was helpful!',
          ];
          const randomResponse = npcResponses[Math.floor(Math.random() * npcResponses.length)];
          state.messages.push({ from: 'npc', text: randomResponse, timestamp: formatDate(new Date()) });
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
  overflow-y: scroll;
}

.chat-window::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent; /* make scrollbar transparent */
}

.player-message .message-content {
  display: inline-block;
  background-color: #007bff;
  color: white;
  max-width: 75%;
  width: auto;
}

.npc-message .message-content {
  display: inline-block;
  background-color: #e9ecef;
  color: black;
  max-width: 75%;
  width: auto;
}

.message-content {
  max-width: 100%;
}

.message-content small {
  display: block;
  margin-bottom: 0.5rem;
}

.message-content p {
  margin-bottom: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* Media queries to handle width */
@media (min-width: 768px) {
  .chat-container {
    max-width: 768px;
  }
}
</style>
