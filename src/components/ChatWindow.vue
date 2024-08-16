<template>
  <div class="chat-container">
    <div class="header">
      <button @click="$emit('back')" class="back-button">Back</button>
      <h2>{{ contact.name }}</h2>
    </div>
    <div class="chat-box">
      <MessagesList :messages="messages" />
      <WaitingDots v-if="isWaiting && !isUserSending" />
    </div>
    <OptionsBox v-if="currentNode && currentNode.options" :options="currentNode.options" @select="selectOptionHandler" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { DialogueNode } from '../types';
import MessagesList from './MessagesList.vue';
import OptionsBox from './OptionsBox.vue';
import WaitingDots from './WaitingDots.vue';
import { useChat } from '../useChat';
import dialogueAlice from '../dialogueAlice';
import dialogueBob from '../dialogueBob';

export default defineComponent({
  components: {
    MessagesList,
    OptionsBox,
    WaitingDots,
  },
  props: {
    contact: {
      type: Object as PropType<{ id: number; name: string }>,
      required: true,
    },
  },
  setup(props) {
    const dialogueTree = ref<Record<string, DialogueNode>>({});
    const { messages, currentNode, isWaiting, isUserSending, sendMessages } = useChat(dialogueTree.value);

    onMounted(() => {
      if (props.contact.name === 'Alice') {
        dialogueTree.value = dialogueAlice;
      } else if (props.contact.name === 'Bob') {
        dialogueTree.value = dialogueBob;
      }

      if (dialogueTree.value['root']) {
        currentNode.value = dialogueTree.value['root'];
        sendMessages(currentNode.value.text, 'bot');
      }
    });

    const selectOptionHandler = (optionIndex: number) => {
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

    return {
      messages,
      currentNode,
      isWaiting,
      isUserSending,
      selectOptionHandler,
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
</style>
