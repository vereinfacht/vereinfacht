import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';

interface Props {
    value?: string;
}

export default function HtmlField({ value }: Props) {
    if (value === null || value === undefined || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <Text className="hyphens-auto whitespace-break-spaces">
            <span
                dangerouslySetInnerHTML={{
                    __html: value,
                }}
            />
        </Text>
    );
}
