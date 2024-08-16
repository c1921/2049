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
        <!-- 等待动画，仅在NPC回复时显示 -->
        <WaitingDots v-if="isWaiting && !isUserSending" />
      </div>
    </div>
    <div v-if="currentNode.options" class="options-box">
      <div class="buttons">
        <button
          v-for="(option, index) in currentNode.options"
          :key="index"
          class="button is-primary"
          @click="selectOption(option)"
        >
          {{ option.text[0] }} <!-- 显示选项的第一句以代表整个选项 -->
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dialogueTree, { DialogueNode, DialogueOption } from '../dialogueTree';
import WaitingDots from '../components/WaitingDots.vue';  // 导入等待动画组件

export default defineComponent({
  components: {
    WaitingDots,  // 注册等待动画组件
  },
  setup() {
    const messages = ref<{ id: number; sender: string; text: string; timestamp: Date }[]>([]);
    const currentNode = ref<DialogueNode>(dialogueTree['root']);
    const isWaiting = ref(false);
    const isUserSending = ref(false);
    const typingSpeed = 5; // 假设打字速度为每秒5个字符
    const userMessageDelay = 500; // 玩家消息的固定延迟

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
      isWaiting.value = sender === 'bot'; // 仅在NPC消息发送时显示动画
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

    const selectOption = (option: DialogueOption) => {
      sendMessages(option.text, 'user', () => {
        setTimeout(() => {
          const nextNode = dialogueTree[option.nextId];
          currentNode.value = nextNode;

          sendMessages(nextNode.text, 'bot', () => {
            // 如果没有选项并且有next属性，自动跳转到下一个节点
            if (!nextNode.options && nextNode.next) {
              setTimeout(() => {
                const nextNextNode = dialogueTree[nextNode.next as string];
                currentNode.value = nextNextNode;
                sendMessages(nextNextNode.text, 'bot');
              }, 1000);
            }
          });
        }, 1000);
      }, true); // 传入 true 以使用固定延迟
    };

    // 初始化对话
    sendMessages(currentNode.value.text, 'bot');

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
/* 原样式代码保持不变 */
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
