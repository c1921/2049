// src/types.ts

export interface DialogueNode {
    id: string;
    text: string[];
    options?: DialogueOption[];
    next?: string;
}

export interface DialogueOption {
    text: string[];
    nextId: string;
}
