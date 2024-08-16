export interface DialogueCondition {
    check: (conditionValue: number) => boolean;
    nextId: string;
}

export interface DialogueNode {
    id: string;
    text: string[];
    options?: DialogueOption[];
    next?: string;
    conditions?: DialogueCondition[]; // 新增条件属性
}

export interface DialogueOption {
    text: string[];
    nextId: string;
}
