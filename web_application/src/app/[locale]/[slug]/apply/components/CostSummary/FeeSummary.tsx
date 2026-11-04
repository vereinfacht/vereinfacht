import { useTranslations } from 'next-intl';
import DataDisplay from '@/app/components/DataDisplay/DataDisplay';
import CostItem, { CostItemProps } from './CostItem';
import { getTotalFee } from './utils';

interface Props {
    label: string;
    items: CostItemProps[];
}

function FeeSummary({ label, items }: Props) {
    const t = useTranslations();
    const totalFee = getTotalFee(items);

    return (
        <DataDisplay label={label} className="mt-4">
            <ul>
                {items.map((item, index) => (
                    <CostItem key={index} {...item} />
                ))}
                <CostItem
                    label={t('application.summary.label.sum')}
                    value={totalFee}
                    highlight
                />
            </ul>
        </DataDisplay>
    );
}

export default FeeSummary;
