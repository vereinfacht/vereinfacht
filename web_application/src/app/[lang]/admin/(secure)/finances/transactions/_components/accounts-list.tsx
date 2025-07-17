import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import createTranslation from 'next-translate/createTranslation';
import AccountCard from './account-card';

async function getAccounts() {
    const response = await listFinanceAccounts({
        include: ['type'],
    });
    return response || [];
}

export default async function AccountsList() {
    const { t } = createTranslation();
    const accounts = await getAccounts();
    const totalAmount = accounts.reduce((sum, account) => {
        return sum + (account.currentBalance || 0);
    }, 0);

    return (
        <ul className="flex flex-col space-y-3 md:w-96">
            <AccountCard
                title={t('transaction:all_accounts')}
                balance={totalAmount}
            />
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
    );
}
