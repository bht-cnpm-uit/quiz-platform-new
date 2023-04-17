import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useRef } from 'react';

function Modal({
    open,
    setOpen,
    warning = true,
    okButtonText,
    cancelButtonText,
    title,
    description,
    onOkButtonClick,
    onCancelButtonClick,
}) {
    const icon = warning ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-red-600"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
        </svg>
    );

    const okButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" initialFocus={okButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-[1000] overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-0 text-center md:items-end md:p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 md:translate-y-4 translate-y-0"
                            enterTo="opacity-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 md:translate-y-4 translate-y-0"
                        >
                            <Dialog.Panel className="relative max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                <div className="bg-white p-6 pb-4 md:px-4 md:pt-5 md:pb-4">
                                    <div className="flex items-start md:block">
                                        <div
                                            className={clsx(
                                                'mx-0 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full  md:mx-auto md:h-12 md:w-12',
                                                {
                                                    'bg-red-100': warning,
                                                }
                                            )}
                                        >
                                            {icon}
                                        </div>
                                        <div className="mt-0 ml-4 text-left md:mt-3 md:ml-0 md:text-center">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className=" text-gray-600">{description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse justify-start bg-gray-50 py-3 px-6 md:block md:px-4">
                                    <button
                                        type="button"
                                        className={clsx(
                                            'ml-3 inline-flex min-w-[120px] justify-center rounded-md border border-transparent px-4 py-2 font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 md:ml-0  md:w-full',
                                            {
                                                ' bg-red-600 hover:bg-red-700 focus:ring-red-500 ': warning,
                                            }
                                        )}
                                        onClick={() => {
                                            setOpen(false);
                                            onOkButtonClick && onOkButtonClick();
                                        }}
                                        ref={okButtonRef}
                                    >
                                        {okButtonText}
                                    </button>
                                    {cancelButtonText && (
                                        <button
                                            type="button"
                                            className="inline-flex min-w-[120px] justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:mt-3 md:w-full"
                                            onClick={() => {
                                                setOpen(false);
                                                onCancelButtonClick && onCancelButtonClick();
                                            }}
                                        >
                                            {cancelButtonText}
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;
