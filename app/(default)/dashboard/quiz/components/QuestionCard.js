'use client';

export default function QuestionCard({ question, onQuestionChange }) {
    function handleContentChange(e) {
        onQuestionChange({ ...question, content: e.target.innerText });
        console.log(e);
    }
    function handleChangeAnswer(e, index) {
        const answers = question.answers;
        answers[index] = e.target.innerText;
        onQuestionChange({ ...question, answers: [...answers] });
    }
    function handleChangeCorrectAnswer(index) {
        onQuestionChange({ ...question, correctAnswer: index });
    }

    function handleDeleteAnswer(index) {
        const answers = question.answers.filter((answer, i) => index !== i);
        onQuestionChange({ ...question, answers: [...answers] });
    }

    function handleAddAnswer() {
        onQuestionChange({ ...question, answers: [...question.answers, `Câu trả lời ${question.answers.length + 1}`] });
    }

    return (
        <div className="border bg-white p-3">
            <div contentEditable suppressContentEditableWarning onBlur={handleContentChange}>
                {question.content}
            </div>
            <hr />
            <div>
                {question?.answers.map((answer, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            checked={index === question.correctAnswer}
                            onChange={() => handleChangeCorrectAnswer(index)}
                        />
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChangeAnswer(e, index)}
                        >
                            {answer}
                        </div>
                        <button onClick={() => handleDeleteAnswer(index)}>Xoá</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddAnswer}>Thêm câu trả lời</button>
        </div>
    );
}
