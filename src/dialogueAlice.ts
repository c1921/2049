import { DialogueNode } from './types';

const dialogueAlice: Record<string, DialogueNode> = {
    root: {
        id: 'root',
        text: ['Hi, I am Alice!', 'How can I help you today?'],
        options: [
            { text: ['Tell me about yourself.'], nextId: 'about' },
            { text: ['Just saying hi!'], nextId: 'hi' },
        ],
    },
    about: {
        id: 'about',
        text: ['I am a software engineer.', 'I love coding!'],
        next: 'root',
    },
    hi: {
        id: 'hi',
        text: ['Hello! Nice to meet you.'],
        next: 'root',
    },
};

export default dialogueAlice;
