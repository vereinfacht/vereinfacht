'use client';

import { useState, cloneElement, ReactElement } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import { Plus } from 'lucide-react';

interface Props {
    triggerLabel: string;
    title: string;
    children: ReactElement<{
        onSuccess?: () => void;
        onCancel?: () => void;
    }>;
}

export default function RelationModal({
    triggerLabel,
    title,
    children,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const formWithCallback = cloneElement(children, {
        onSuccess: () => {
            setTimeout(() => {
                setIsOpen(false);
            }, 1000);
        },
        onCancel: () => setIsOpen(false),
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button preset="primary" className="mb-6">
                    <Plus className="mr-2 h-4 w-4" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">{title}</Text>
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-6">{formWithCallback}</div>
            </DialogContent>
        </Dialog>
    );
}
