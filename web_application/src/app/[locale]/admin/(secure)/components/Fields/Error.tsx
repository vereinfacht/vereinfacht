import Text from '@/app/components/Text/Text';

interface Props {
    error: string;
}

export default function Error({ error }: Props) {
    return (
        <Text preset="error" className="pl-2" tag="span">
            {error}
        </Text>
    );
}
