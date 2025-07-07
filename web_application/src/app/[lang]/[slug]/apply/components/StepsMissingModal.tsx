'use client';

import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import { Dialog, Transition } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { Fragment } from 'react';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function StepsMissingModal({ isOpen, setIsOpen }: Props) {
    const { t } = useTranslation();
    function closeModal() {
        setIsOpen(false);
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as={Text} preset="headline">
                                    {t('application:steps_missing_modal.title')}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <Text>
                                        {t(
                                            'application:steps_missing_modal.description',
                                        )}
                                    </Text>
                                </div>

                                <div className="mt-4">
                                    <Button onClick={closeModal}>
                                        {t(
                                            'application:steps_missing_modal.ok',
                                        )}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
