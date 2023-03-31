'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import ReadOnlyEditor from '~/app/components/Editor/ReadOnlyEditor';

const anim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function SingleChoice({
    chosen = false,
    answer = false,
    incorrect = false,
    disabled = false,
    children,
    onClick,
}) {
    function getIcon() {
        if (incorrect) {
            return (
                <motion.div
                    className="mr-3 flex w-7 items-center text-red-500"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="h-7 w-7"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </motion.div>
            );
        }
        if (chosen) {
            return (
                <motion.div
                    className="mr-3 flex w-7 items-center text-green-600"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.div>
            );
        }
        return (
            <div className="mr-3 flex w-7 items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="h-7 w-7"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        );
    }

    return (
        <motion.div
            className={clsx(
                'flex cursor-pointer items-center rounded-lg border border-white bg-white p-4 text-gray-700 hover:border-primary',
                {
                    '!border-red-500 !bg-red-500/10': incorrect,
                    '!border-green-500 !bg-green-500/10': answer,
                    'border-primary': chosen,
                    'pointer-events-none': disabled,
                }
            )}
            onClick={() => onClick && onClick()}
            whileTap={{ scale: 1 }}
            whileHover={{ scale: 1.03 }}
            variants={anim}
        >
            {getIcon()}
            <div>
                <ReadOnlyEditor content={children} />
            </div>
        </motion.div>
    );
}
