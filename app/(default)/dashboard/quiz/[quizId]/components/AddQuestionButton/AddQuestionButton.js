'use client';

import { useState } from 'react';
import Modal from './Modal';
import clsx from 'clsx';

export default function AddQuestionButton() {
    const [isOpenModal, setIsOpenModal] = useState(false);

    return (
        <>
            <button
                className={clsx('w-full rounded border py-2 px-5 font-medium text-primary hover:border-gray-700')}
                onClick={() => setIsOpenModal(!isOpenModal)}
            >
                Tạo câu hỏi
            </button>
            {isOpenModal && <Modal setIsOpen={setIsOpenModal} />}
        </>
    );
}
