<template>
  <div class="chat-container">
    <div class="header">
      <button @click="$emit('back')" class="back-button">Back</button>
      <h2>{{ contact.name }}</h2>
    </div>
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
        <WaitingDots v-if="isWaiting && !isUserSending" />
      </div>
    </div>
    <div v-if="currentNode && currentNode.options" class="options-box">
      <div class="buttons">
        <button
          v-for="(option, index) in currentNode.options"
          :key="index"
          class="button is-primary"
          @click="selectOption(index)"
        >
          {{ option.text[0] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { DialogueNode } from '../types';
import WaitingDots from '../components/WaitingDots.vue';
import dialogueAlice from '../dialogueAlice';
import dialogueBob from '../dialogueBob';

export default defineComponent({
  components: {
    WaitingDots,
  },
  props: {
    contact: {
      type: Object as PropType<{ id: number; name: string }>,
      required: true,
    },
  },
  setup(props) {
    const messages = ref<{ id: number; sender: string; text: string; timestamp: Date }[]>([]);
    const currentNode = ref<DialogueNode | null>(null);
    const isWaiting = ref(false);
    const isUserSending = ref(false);
    const typingSpeed = 5;
    const userMessageDelay = 500;
    const dialogueTree = ref<Record<string, DialogueNode>>({});

    onMounted(() => {
      if (props.contact.name === 'Alice') {
        dialogueTree.value = dialogueAlice;
      } else if (props.contact.name === 'Bob') {
        dialogueTree.value = dialogueBob;
      }
      currentNode.value = dialogueTree.value['root'] || null; // 如果没有找到 'root' 节点，currentNode 将为 null
      if (currentNode.value) {
        sendMessages(currentNode.value.text, 'bot');
      }
    });

    const addMessage = (sender: string, text: string) => {
      messages.value.push({
        id: Date.now(),
        sender,
        text,
        timestamp: new Date(),
      });
    };

    const sendMessages = (
      texts: string[],
      sender: string,
      callback?: () => void,
      constantDelay = false
    ) => {
      isWaiting.value = sender === 'bot';
      isUserSending.value = sender === 'user';

      texts.reduce((promiseChain, text, index) => {
        const delay = constantDelay ? userMessageDelay : (text.length / typingSpeed) * 1000;
        return promiseChain.then(() => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              addMessage(sender, text);
              resolve();
              if (callback && index === texts.length - 1) {
                callback();
              }
            }, delay);
          });
        });
      }, Promise.resolve()).then(() => {
        isWaiting.value = false;
        isUserSending.value = false;
      });
    };

    const selectOption = (optionIndex: number) => {
      if (!currentNode.value || !currentNode.value.options) return;

      const option = currentNode.value.options[optionIndex];

      sendMessages(option.text, 'user', () => {
        setTimeout(() => {
          const nextNode = dialogueTree.value![option.nextId];
          currentNode.value = nextNode;

          sendMessages(nextNode.text, 'bot', () => {
            if (!nextNode.options && nextNode.next) {
              setTimeout(() => {
                const nextNextNode = dialogueTree.value![nextNode.next as string];
                currentNode.value = nextNextNode;
                sendMessages(nextNextNode.text, 'bot');
              }, 1000);
            }
          });
        }, 1000);
      }, true);
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
      currentNode,
      selectOption,
      formatTimestamp,
      isWaiting,
      isUserSending,
    };
  },
});
</script>

<style scoped>
/* 原有样式 */
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

.header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #48c774;
  color: white;
}

.back-button {
  margin-right: 10px;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
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

.options-box {
  padding: 1rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button {
  flex: 1;
  margin: 0.25rem;
}
</style>
