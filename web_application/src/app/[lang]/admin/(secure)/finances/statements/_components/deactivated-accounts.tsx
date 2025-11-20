import Text from '@/app/components/Text/Text';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/app/components/ui/accordion';
import { TFinanceAccountDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import AccountCard from './account-card';

interface Props {
    accounts: TFinanceAccountDeserialized[];
}

export default function DeactivatedAccounts({ accounts }: Props) {
    const { t } = useTranslation();

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-slate-700">
                    <Text>{t('finance_account:deactivated')}</Text>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <ul className="flex flex-col space-y-3 md:w-96">
                        {accounts.map((account) => {
                            return (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    balance={account.currentBalance}
                                    title={account.title || t('admin:unnamed')}
                                />
                            );
                        })}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
