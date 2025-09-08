'use client';

import CurrencyText from '@/app/components/Text/CurrencyText';
import { Button } from '@/app/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { TTransactionDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';

interface TransactionDetailsModalProps {
    transaction: TTransactionDeserialized;
    isOpen: boolean;
    onClose: () => void;
}

export default function TransactionDetailsModal({
    transaction,
    isOpen,
    onClose,
}: TransactionDetailsModalProps) {
    const translationHook = useTranslation();
    const lang = translationHook.lang as SupportedLocale;
    const { t } = translationHook;

    if (!transaction) return null;

    const amount = transaction.amount || 0;
    const purpose = transaction.description || t('default_values.purpose');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {t('transaction:transaction_details.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Transaction Summary */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                {t(
                                    'transaction:transaction_details.transaction_overview',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:title.label')}
                                    </label>
                                    <p className="mt-1 text-sm font-medium">
                                        {transaction.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:purpose.label')}
                                    </label>
                                    <p className="mt-1 text-sm">{purpose}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:booked_at.label')}
                                    </label>
                                    <p className="mt-1 text-sm">
                                        {formatDate(transaction.bookedAt, lang)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:valued_at.label')}
                                    </label>
                                    <p className="mt-1 text-sm">
                                        {formatDate(transaction.valuedAt, lang)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                {t('transaction_details.financial_information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('finance_account:title.label')}
                                    </label>
                                    <p className="mt-1 text-sm">
                                        {transaction.financeAccount?.title}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:amount.label')}
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <CurrencyText value={amount} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction:iban.label')}
                                    </label>
                                    <p className="bg-muted text-muted-foreground mt-1 rounded font-mono text-sm">
                                        {transaction.financeAccount?.iban}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                {t('transaction_details.additional_details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('receipt')}
                                    </label>
                                    <Button
                                        variant="link"
                                        className="text-primary mt-1 h-auto p-0 text-sm"
                                    >
                                        Nr. 12315412
                                    </Button>
                                </div>
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        {t('transaction_details.assigned_on')}
                                    </label>
                                    <p className="mt-1 text-sm">
                                        {formatDate(
                                            transaction.createdAt,
                                            lang as SupportedLocale,
                                            'dd.MM.yyyy',
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">
                                    {t('transaction_details.assigned_by')}
                                </label>
                                <Button
                                    variant="link"
                                    className="text-primary mt-1 h-auto p-0 text-sm"
                                >
                                    Petra Klub
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
