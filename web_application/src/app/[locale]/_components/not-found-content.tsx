'use client';

import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import { useRouter } from 'next/navigation';
import IconCheck from '/public/svg/broken_url.svg';

interface Props {
    headline: string;
    subline: string;
    description: string;
    backLabel: string;
}

export default function NotFoundContent({
    headline,
    subline,
    description,
    backLabel,
}: Props) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full justify-center p-6">
            <div className="flex flex-col items-center gap-8 self-center">
                <Text preset="display-light" tag="h1">
                    {headline}
                </Text>
                <div className="flex items-center gap-4">
                    <IconCheck className="h-12 stroke-red-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                    <Text preset="headline" tag="h2">
                        {subline}
                    </Text>
                </div>
                <Text className="text-center">{description}</Text>
                <Button onClick={() => router.back()}>{backLabel}</Button>
            </div>
        </div>
    );
}
