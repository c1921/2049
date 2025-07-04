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
            {
                text: [
                    "ddd"
                ],
                nextId: "efee3b69c37b4f75"
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
    "4419f916be0423d9": {
        id: "4419f916be0423d9",
        text: [
            "777"
        ],
        options: []
    },
    "06783d40aa807168": {
        id: "06783d40aa807168",
        text: [
            "NO"
        ],
        options: []
    },
    root: {
        id: "root",
        text: [
            "111",
            "222",
            "sdd"
        ],
        options: [
            {
                text: [
                    "aaa",
                    "zzz"
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
"efee3b69c37b4f75": {
        id: "efee3b69c37b4f75",
        text: [],
        next: "",
        conditions: [
            {
                check: (conditionValue: number) => conditionValue === 1,
                nextId: "4419f916be0423d9"
            },
            {
                check: (conditionValue: number) => conditionValue !== 1,
                nextId: "06783d40aa807168"
            }
        ]
    },
};

export default dialogueAlice;