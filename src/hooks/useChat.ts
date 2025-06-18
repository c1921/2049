import { ref, watch } from 'vue';
import { DialogueNode } from '../dialogues/types';

// 全局对话状态存储
interface ChatState {
    messages: { id: number; sender: string; text: string; timestamp: Date }[];
    currentNodeId: string | null;
    isWaiting: boolean;
    isUserSending: boolean;
}

const globalChatStates: Record<number, ChatState> = {};

export function useChat(dialogueTree: Record<string, DialogueNode>, contactId: number) {
    // 如果不存在该联系人的状态，则创建
    if (!globalChatStates[contactId]) {
        globalChatStates[contactId] = {
            messages: [],
            currentNodeId: 'root',
            isWaiting: false,
            isUserSending: false
        };
    }

    // 从全局状态中获取该联系人的状态
    const chatState = globalChatStates[contactId];
    
    // 创建响应式引用
    const messages = ref(chatState.messages);
    const currentNode = ref<DialogueNode | null>(
        chatState.currentNodeId && dialogueTree[chatState.currentNodeId] 
            ? dialogueTree[chatState.currentNodeId] 
            : null
    );
    const isWaiting = ref(chatState.isWaiting);
    const isUserSending = ref(chatState.isUserSending);
    
    const typingSpeed = 15;
    const userMessageDelay = 500;
    let isCancelled = false;

    // 监听对话树变化，更新当前节点
    watch(() => dialogueTree, (newDialogueTree) => {
        if (chatState.currentNodeId && newDialogueTree[chatState.currentNodeId]) {
            currentNode.value = newDialogueTree[chatState.currentNodeId];
        }
    }, { deep: true });

    const addMessage = (sender: string, text: string) => {
        const newMessage = {
            id: Date.now(),
            sender,
            text,
            timestamp: new Date(),
        };
        messages.value.push(newMessage);
        // 同步到全局状态
        chatState.messages = messages.value;
    };

    const resetChat = () => {
        messages.value = [];
        currentNode.value = null;
        isWaiting.value = false;
        isUserSending.value = false;
        // 同步到全局状态
        chatState.messages = [];
        chatState.currentNodeId = null;
        chatState.isWaiting = false;
        chatState.isUserSending = false;
        // 取消所有正在进行的消息发送
        isCancelled = true;
    };

    const sendMessages = (
        texts: string[],
        sender: string,
        callback?: () => void,
        constantDelay = false
    ) => {
        // 重置取消状态
        isCancelled = false;
        isWaiting.value = sender === 'bot';
        isUserSending.value = sender === 'user';
        // 同步到全局状态
        chatState.isWaiting = isWaiting.value;
        chatState.isUserSending = isUserSending.value;

        texts.reduce((promiseChain, text, index) => {
            const delay = constantDelay ? userMessageDelay : (text.length / typingSpeed) * 1000;
            return promiseChain.then(() => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        // 如果已取消，则不添加消息
                        if (!isCancelled) {
                            addMessage(sender, text);
                            if (callback && index === texts.length - 1) {
                                callback();
                            }
                        }
                        resolve();
                    }, delay);
                });
            });
        }, Promise.resolve()).then(() => {
            if (!isCancelled) {
                isWaiting.value = false;
                isUserSending.value = false;
                // 同步到全局状态
                chatState.isWaiting = false;
                chatState.isUserSending = false;
            }
        });
    };

    const selectOption = (optionIndex: number) => {
        if (!currentNode.value || !currentNode.value.options) return;

        const option = currentNode.value.options[optionIndex];

        sendMessages(option.text, 'user', () => {
            setTimeout(() => {
                if (isCancelled) return;
                
                const nextNode = dialogueTree[option.nextId];
                currentNode.value = nextNode;
                // 同步到全局状态
                chatState.currentNodeId = option.nextId;

                sendMessages(nextNode.text, 'bot', () => {
                    if (isCancelled) return;
                    
                    if (!nextNode.options && nextNode.next) {
                        setTimeout(() => {
                            if (isCancelled) return;
                            
                            const nextNextNodeId = nextNode.next as string;
                            const nextNextNode = dialogueTree[nextNextNodeId];
                            currentNode.value = nextNextNode;
                            // 同步到全局状态
                            chatState.currentNodeId = nextNextNodeId;
                            sendMessages(nextNextNode.text, 'bot');
                        }, 1000);
                    }
                });
            }, 1000);
        }, true);
    };

    const updateCurrentNode = (nodeId: string) => {
        if (dialogueTree[nodeId]) {
            currentNode.value = dialogueTree[nodeId];
            chatState.currentNodeId = nodeId;
        }
    };

    return {
        messages,
        currentNode,
        isWaiting,
        isUserSending,
        sendMessages,
        selectOption,
        resetChat,
        updateCurrentNode
    };
}
