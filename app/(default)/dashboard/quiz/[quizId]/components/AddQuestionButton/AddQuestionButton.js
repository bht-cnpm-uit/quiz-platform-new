'use client';

import { useState } from 'react';
import Modal from './Modal';
import clsx from 'clsx';

export default function AddQuestionButton({ quizId, ...props }) {
    const [isOpenModal, setIsOpenModal] = useState(false);

    return (
        <>
            <button {...props} onClick={() => setIsOpenModal(!isOpenModal)}>
                Tạo câu hỏi
            </button>
            {isOpenModal && <Modal quizId={quizId} setIsOpen={setIsOpenModal} />}
        </>
    );
}
