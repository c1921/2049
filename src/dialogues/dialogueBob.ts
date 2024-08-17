import { DialogueNode } from '../types';

const dialogueBob: Record<string, DialogueNode> = {
    root: {
        id: 'root',
        text: ['Hey there, I am Bob.', 'What can I do for you?'],
        options: [
            { text: ['What do you do?'], nextId: 'job' },
            { text: ['Just checking in.'], nextId: 'checkIn' },
        ],
    },
    job: {
        id: 'job',
        text: ['I am a product manager.', 'I oversee projects.'],
        next: 'root',
    },
    checkIn: {
        id: 'checkIn',
        text: ['All good here!', 'Thanks for checking in.'],
        next: 'root',
    },
};

export default dialogueBob;
