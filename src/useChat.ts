import { ref } from 'vue';
import { DialogueNode } from './types';

export function useChat(dialogueTree: Record<string, DialogueNode>) {
    const messages = ref<{ id: number; sender: string; text: string; timestamp: Date }[]>([]);
    const currentNode = ref<DialogueNode | null>(dialogueTree['root']);
    const isWaiting = ref(false);
    const isUserSending = ref(false);
    const typingSpeed = 15;
    const userMessageDelay = 500;

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
                const nextNode = dialogueTree[option.nextId];
                currentNode.value = nextNode;

                sendMessages(nextNode.text, 'bot', () => {
                    if (!nextNode.options && nextNode.next) {
                        setTimeout(() => {
                            const nextNextNode = dialogueTree[nextNode.next as string];
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
        sendMessages,
        selectOption,
    };
}
