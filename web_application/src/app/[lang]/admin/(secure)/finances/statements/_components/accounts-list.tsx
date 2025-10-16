import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import createTranslation from 'next-translate/createTranslation';
import AccountCard from './account-card';
import CreateAccountModal from './create-account-modal';
import { isPast } from 'date-fns';
import { TFinanceAccountDeserialized } from '@/types/resources';
import DeactivatedAccounts from './deactivated-accounts';

async function getAccounts() {
    const response = await listFinanceAccounts({
        filter: {
            'with-trashed': true,
        },
    });
    return response || [];
}

export default async function AccountsList() {
    const { t } = createTranslation();
    const accounts = await getAccounts();
    const totalAmount = accounts.reduce((sum, account) => {
        return sum + (account.currentBalance || 0);
    }, 0);
    const activatedAccounts: TFinanceAccountDeserialized[] = [];
    const deactivatedAccounts: TFinanceAccountDeserialized[] = [];

    accounts.forEach((account) => {
        if (isPast(account.deletedAt ?? '')) {
            deactivatedAccounts.push(account);
        } else {
            activatedAccounts.push(account);
        }
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <ul className="flex flex-col space-y-3 md:w-96">
                <AccountCard
                    title={t('transaction:all_sources')}
                    balance={totalAmount}
                />
                {activatedAccounts?.map((account) => {
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
            {deactivatedAccounts.length > 0 && (
                <DeactivatedAccounts accounts={deactivatedAccounts} />
            )}
        </div>
    );
}
