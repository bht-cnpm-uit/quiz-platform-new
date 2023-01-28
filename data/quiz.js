const QUIZ = {
    name: 'Ôn tập Javascript cơ bản',
    questions: [
        {
            type: 'single-choose',
            content: 'Viết code javascript bên trong thẻ html nào?',
            answers: ['<scriping>', '<script>', '<javascript>', '<js>'],
            correctAnswer: 1,
            hint: 'Có thể viết javascript ngay trong html bằng 1 thẻ nào đó',
            explanation: 'Thẻ <script> dùng để viết code Javascript',
        },
        {
            type: 'single-choose',
            content: 'Một hàm được truyền vào một hàm khác dưới dạng tham số được gọi là gì?',
            answers: ['Callback', 'Expression function', 'Arrow function', 'Closure'],
            correctAnswer: 0,
            hint: null,
            explanation: 'Nó là callback',
        },
        {
            type: 'single-choose',
            content: 'Đâu là một trong các kiểu dữ liệu Reference',
            answers: ['String', 'Null', 'Object', 'Number'],
            correctAnswer: 2,
            hint: 'Có 2 loại kiểu dữ liệu là Primtive và Reference',
            explanation:
                'Kiểu Primtive bao gồm: Number, String, Boolean, Null, Undefined, Symbols. Kiểu Reference bao gồm: Object, Function, Array, và các kiểu khác của Object...',
        },
        {
            type: 'single-choose',
            content: 'IIFE trong javascript là gì',
            answers: [
                'Một hàm được truyền vào hàm khác dưới dạng tham số',
                'Một hàm dùng để khởi tạo một Object',
                'Một hàm không có giá trị trả về',
                'Một hàm được khởi tạo và thực thi ngay lập tức',
            ],
            correctAnswer: 3,
            hint: 'IIFE là viết tắt của Immediately Invoked Function Expression',
            explanation: null,
        },
        {
            type: 'single-choose',
            content: 'Điền vào chỗ trống: Global variables can be made local (private) with ______.',
            answers: ['Closure', 'Callback', 'Promise', 'Async Function'],
            correctAnswer: 0,
            hint: 'Đây là một định nghĩa theo W3schools',
            explanation: null,
        },
        {
            type: 'single-choose',
            content: 'Đâu không phải là trạng thái của một Promise',
            answers: ['Pending', 'Fulfilled', 'Errored', 'Rejected'],
            correctAnswer: 2,
            hint: 'Một Promise có 3 trạng thái',
            explanation: '3 trạng thái của một Promise là pending, fulfilled và rejected',
        },
        {
            type: 'single-choose',
            content: 'Callback truyền vào hàm setTimeout sẽ được đưa vào đâu?',
            answers: ['Call Stack', 'Queue', 'Web API'],
            correctAnswer: 2,
            hint: 'setTimeout được cung cấp bởi trình duyệt',
            explanation:
                'Callback được đưa vào vùng Web API, chờ một khoảng thời gian và được đưa vào Queue. Sau đó Event Loop sẽ đẩy lần lượt các hàm đang đợi trong Queue vào Call Stack nếu Stack đang trống',
        },
    ],
};

export default QUIZ;
