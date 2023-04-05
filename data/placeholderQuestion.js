import { nanoid } from 'nanoid';

const answerId1 = nanoid();
const answerId2 = nanoid();
const answerId3 = nanoid();
const answerId4 = nanoid();

const placeholderQuestion = {
    content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu hỏi mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    type: 'single-choose',
    correctAnswer: answerId1,
    answers: [
        {
            id: answerId1,
            content:
                '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        },
        {
            id: answerId2,
            content:
                '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        },
        {
            id: answerId3,
            content:
                '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        },
        {
            id: answerId4,
            content:
                '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        },
    ],
};

export default placeholderQuestion;
