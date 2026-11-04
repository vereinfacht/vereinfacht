import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';

interface Props {
    value?: number | string;
}

export default function ColorField({ value }: Props) {
    if (!value || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <div className="mb-2 flex items-center gap-4">
            <div className="bg-primary-500 h-8 w-8 rounded-full"></div>
            <Text>{value}</Text>
        </div>
    );
}
