// src/dialogueTree.ts

export interface DialogueNode {
    id: string;
    text: string;
    options?: DialogueOption[];
    next?: string;
}

export interface DialogueOption {
    text: string;
    nextId: string;
}

const dialogueTree: Record<string, DialogueNode> = {
    root: {
        id: 'root',
        text: 'Hello, adventurer! What brings you here?',
        options: [
            { text: 'I am here for a quest.', nextId: 'quest' },
            { text: 'Just passing by.', nextId: 'passBy' },
        ],
    },
    quest: {
        id: 'quest',
        text: 'A quest, you say? What kind of quest?',
        options: [
            { text: 'A dangerous one.', nextId: 'dangerousQuest' },
            { text: 'A simple task.', nextId: 'simpleQuest' },
        ],
    },
    passBy: {
        id: 'passBy',
        text: 'Safe travels, then!',
        next: 'root',
    },
    dangerousQuest: {
        id: 'dangerousQuest',
        text: 'Ah, a brave soul! Take this sword for your journey.',
        next: 'root',
    },
    simpleQuest: {
        id: 'simpleQuest',
        text: 'Here, take this map and find the hidden treasure.',
        next: 'root',
    },
};

export default dialogueTree;
