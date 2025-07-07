import DataDisplay from '@/app/components/DataDisplay/DataDisplay';
import CostItem, { CostItemProps } from './CostItem';
import useTranslation from 'next-translate/useTranslation';
import { getTotalFee } from './utils';

interface Props {
    label: string;
    items: CostItemProps[];
}

function FeeSummary({ label, items }: Props) {
    const { t } = useTranslation('application');
    const totalFee = getTotalFee(items);

    return (
        <DataDisplay label={label} className="mt-4">
            <ul>
                {items.map((item, index) => (
                    <CostItem key={index} {...item} />
                ))}
                <CostItem
                    label={t('summary.label.sum')}
                    value={totalFee}
                    highlight
                />
            </ul>
        </DataDisplay>
    );
}

export default FeeSummary;
