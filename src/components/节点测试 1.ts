import { DialogueNode } from '../types';

const dialogueAlice: Record<string, DialogueNode> = {

    "2501c7a41c7ee526": {
        id: "2501c7a41c7ee526",
        text: [
            "选择了02"
        ],
        options: [
            {
                text: [
                    "c"
                ],
                nextId: "fa7a6d656e6537ed"
            },
            {
                text: [
                    "b"
                ],
                nextId: "76e0646ffaae27a9"
            },
            {
                text: [
                    "a"
                ],
                nextId: "fcc54a3376b49214"
            }
        ]
    },
    fb37cb7d3a38f871: {
        id: "fb37cb7d3a38f871",
        text: [
            "选择了01"
        ],
        options: [
            {
                text: [
                    "a"
                ],
                nextId: "fcc54a3376b49214"
            },
            {
                text: [
                    "b"
                ],
                nextId: "76e0646ffaae27a9"
            }
        ]
    },
    fcc54a3376b49214: {
        id: "fcc54a3376b49214",
        text: [
            "end1"
        ],
        options: []
    },
    "76e0646ffaae27a9": {
        id: "76e0646ffaae27a9",
        text: [
            "end2"
        ],
        options: []
    },
    fa7a6d656e6537ed: {
        id: "fa7a6d656e6537ed",
        text: [
            "end3"
        ],
        options: []
    },
    root: {
        id: "root",
        text: [
            "AAAAA\n"
        ],
        options: [
            {
                text: [
                    "第二 02"
                ],
                nextId: "2501c7a41c7ee526"
            },
            {
                text: [
                    "第二 01"
                ],
                nextId: "fb37cb7d3a38f871"
            }
        ]
    }

};

export default dialogueAlice;