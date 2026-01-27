import { getOne } from '@/actions/fetchAdminResources';
import { Club } from '@/types/models';
import { auth } from '@/utils/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import List from './List';
import Title from './Title';
import createTranslation from 'next-translate/createTranslation';

export default async function Navigation() {
    const { t } = createTranslation();
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    const [club] = await getOne<Club>('clubs', session.club_id, {});

    const items = [
        {
            href: '/admin/dashboard',
            title: t('admin:dashboard'),
        },
        {
            href: '/admin/memberships',
            title: t('membership:title.other'),
        },
        {
            title: t('admin:finances'),
            items: [
                {
                    href: '/admin/finances/statements',
                    title: t('statement:title.other'),
                },
                {
                    href: '/admin/finances/receipts',
                    title: t('receipt:title.other'),
                },
                {
                    href: '/admin/finances/contacts',
                    title: t('admin:contacts'),
                },
            ],
        },
        {
            title: t('admin:settings'),
            items: [
                {
                    href: '/admin/club',
                    title: t('club:title.one'),
                },
                {
                    href: '/admin/divisions',
                    title: t('division:title.other'),
                },
                {
                    href: '/admin/membershipTypes',
                    title: t('membership_type:title.other'),
                },
                {
                    href: '/admin/tax-accounts',
                    title: t('tax_account:title.other'),
                },
                {
                    href: '/admin/users',
                    title: t('user:title.other'),
                },
                // {
                //     href: '/admin/dashboard',
                //     title: t('user:title.other'),
                // },
            ],
        },
    ];

    return (
        <div className="flex items-center justify-between bg-linear-to-b from-white via-white to-slate-400 md:block md:shrink-0 md:bg-linear-to-r">
            <div className="flex items-center">
                <Link href="/admin/dashboard">
                    <picture className="mt-[0.1em] flex h-20 items-center px-6">
                        <img
                            src={club?.logoUrl}
                            alt={`Logo ${club?.title}`}
                            height={48}
                            width={48}
                        />
                    </picture>
                </Link>
                <Title className="md:hidden" />
            </div>
            <List items={items} />
        </div>
    );
}
