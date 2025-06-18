<template>
  <div class="flex flex-col h-screen overflow-hidden rounded-lg">
    <div class="navbar bg-base-300 text-primary-content">
      <div class="navbar-start">
        <button @click="$emit('back')" class="btn btn-ghost btn-circle">
          <span class="icon-[tabler--arrow-left] size-5"></span>
        </button>
      </div>
      <div class="navbar-center">
        <h2 class="text-xl font-bold">{{ contact.name }}</h2>
      </div>
      <div class="navbar-end"></div>
    </div>
    <div class="flex-1 overflow-y-auto p-4 bg-base-200">
      <MessagesList :messages="messages" />
      <WaitingDots v-if="isWaiting && !isUserSending" />
    </div>
    <OptionsBox v-if="currentNode && currentNode.options" :options="currentNode.options" @select="selectOptionHandler" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from 'vue';
import { DialogueNode } from '../dialogues/types';
import MessagesList from './MessagesList.vue';
import OptionsBox from './OptionsBox.vue';
import WaitingDots from './WaitingDots.vue';
import { useChat } from '../hooks/useChat';
import dialogueAlice from '../dialogues/dialogueAlice';
import dialogueBob from '../dialogues/dialogueBob';

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
    const conditionValue = ref(0); // 定义条件变量
    
    // 初始化对话树函数
    const initDialogueTree = () => {
      if (props.contact.name === 'Alice') {
        dialogueTree.value = dialogueAlice;
      } else if (props.contact.name === 'Bob') {
        dialogueTree.value = dialogueBob;
      }
    };
    
    // 初始化对话树
    initDialogueTree();
    
    // 使用全局对话状态管理器
    const { messages, currentNode, isWaiting, isUserSending, sendMessages, updateCurrentNode } = useChat(dialogueTree.value, props.contact.id);

    // 监听联系人变化
    watch(() => props.contact, () => {
      // 重新初始化对话树
      initDialogueTree();
      
      // 重新获取当前节点
      if (currentNode.value === null && dialogueTree.value['root'] && messages.value.length === 0) {
        updateCurrentNode('root');
        sendMessages(dialogueTree.value['root'].text, 'bot');
      }
    }, { deep: true });

    onMounted(() => {
      // 如果是新对话（没有消息），则加载根节点消息
      if (messages.value.length === 0 && dialogueTree.value['root']) {
        updateCurrentNode('root');
        sendMessages(currentNode.value!.text, 'bot');
      }
    });

    const resolveNextNodeId = (optionNextId: string): string => {
      const node = dialogueTree.value[optionNextId];

      if (node && node.conditions) {
        for (const condition of node.conditions) {
          if (condition.check(conditionValue.value)) {
            return condition.nextId;
          }
        }
      }

      return optionNextId;
    };

    const selectOptionHandler = (optionIndex: number) => {
      if (!currentNode.value || !currentNode.value.options) return;

      const option = currentNode.value.options[optionIndex];
      const nextNodeId = resolveNextNodeId(option.nextId);

      sendMessages(option.text, 'user', () => {
        setTimeout(() => {
          const nextNode = dialogueTree.value![nextNodeId];
          updateCurrentNode(nextNodeId);

          sendMessages(nextNode.text, 'bot', () => {
            if (!nextNode.options && nextNode.next) {
              setTimeout(() => {
                const nextNextNodeId = nextNode.next as string;
                updateCurrentNode(nextNextNodeId);
                const nextNextNode = dialogueTree.value![nextNextNodeId];
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
