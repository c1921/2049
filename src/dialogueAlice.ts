import { DialogueNode } from './types';

const dialogueAlice: Record<string, DialogueNode> = {
    root: {
        id: 'root',
        text: ['Hi, I am Alice!', 'How can I help you today?'],
        options: [
            { text: ['Tell me about yourself.'], nextId: 'checkCondition' },
            { text: ['Just saying hi!'], nextId: 'hi' },
        ],
    },
    about: {
        id: 'about',
        text: ['I am a software engineer.', 'I love coding!'],
        next: 'root',
    },
    no: {
        id: 'no',
        text: ['No.'],
        next: 'root',
    },
    checkCondition: {
        id: 'checkCondition',
        text: [],
        options: [], // 临时占位符
        next: '', // 由条件逻辑决定
        conditions: [
            {
                check: (conditionValue: number) => conditionValue === 1,
                nextId: 'about',
            },
            {
                check: (conditionValue: number) => conditionValue !== 1,
                nextId: 'no',
            },
        ],
    },
    hi: {
        id: 'hi',
        text: ['Hello! Nice to meet you.'],
        next: 'root',
    },
};

export default dialogueAlice;
