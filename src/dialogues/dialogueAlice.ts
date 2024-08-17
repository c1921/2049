import { DialogueNode } from './types';

const dialogueAlice: Record<string, DialogueNode> = {

    d911bfce90df4c1c: {
        id: "d911bfce90df4c1c",
        text: [
            "222"
        ],
        options: [
            {
                text: [
                    "ccc"
                ],
                nextId: "276ec99e5cde8bb5"
            },
        ]
    },
    cec84343b6b64948: {
        id: "cec84343b6b64948",
        text: [
            "666"
        ],
        options: []
    },
    ce021a35a58a5bf9: {
        id: "ce021a35a58a5bf9",
        text: [
            "no"
        ],
        options: []
    },
    "4419f916be0423d9": {
        id: "4419f916be0423d9",
        text: [
            "777"
        ],
        options: []
    },
    "26b63112c720df19": {
        id: "26b63112c720df19",
        text: [
            "333"
        ],
        options: [
            {
                text: [
                    "ddd"
                ],
                nextId: "4419f916be0423d9"
            },
        ]
    },
    root: {
        id: "root",
        text: [
            "111"
        ],
        options: [
            {
                text: [
                    "aaa"
                ],
                nextId: "d911bfce90df4c1c"
            },
            {
                text: [
                    "bbb"
                ],
                nextId: "26b63112c720df19"
            },
        ]
    },

"276ec99e5cde8bb5": {
        id: "276ec99e5cde8bb5",
        text: [],
        next: "",
        conditions: [
            {
                check: (conditionValue: number) => conditionValue === 1,
                nextId: "cec84343b6b64948"
            },
            {
                check: (conditionValue: number) => conditionValue !== 1,
                nextId: "ce021a35a58a5bf9"
            }
        ]
    },
};

export default dialogueAlice;