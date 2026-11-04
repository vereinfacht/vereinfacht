import { BooleanIcon } from '@/app/components/BooleanIcon';

interface Props {
    value?: number;
}

export default function BooleanField({ value }: Props) {
    return <BooleanIcon checked={Boolean(value)} />;
}
