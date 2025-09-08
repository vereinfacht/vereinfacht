import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import createTranslation from 'next-translate/createTranslation';
import AccountCard from './account-card';
import CreateAccountModal from './create-account-modal';

async function getAccounts() {
    const response = await listFinanceAccounts();
    return response || [];
}

export default async function AccountsList() {
    const { t } = createTranslation();
    const accounts = await getAccounts();
    const totalAmount = accounts.reduce((sum, account) => {
        return sum + (account.currentBalance || 0);
    }, 0);

    return (
        <div className="flex flex-col items-center gap-8">
            <ul className="flex flex-col space-y-3 md:w-96">
                <AccountCard
                    title={t('transaction:all_sources')}
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
            <CreateAccountModal />
        </div>
    );
}
