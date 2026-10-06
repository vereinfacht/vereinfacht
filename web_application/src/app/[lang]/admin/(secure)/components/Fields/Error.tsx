import Text from '@/app/components/Text/Text';
import React from 'react';
import IconAlert from '/public/svg/alert-circle.svg';

interface Props {
    error: string;
}

export default function Error({ error }: Props) {
    return (
        <div className="text-textError flex flex-row">
            <IconAlert />
            <Text preset="error" className="pl-2" tag="span">
                {error}
            </Text>
        </div>
    );
}
