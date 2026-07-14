import { getOne } from '@/actions/fetchAdminResources';
import { Club } from '@/types/models';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import createTranslation from 'next-translate/createTranslation';
import MembershipsIcon from '/public/svg/memberships.svg';
import ClubIcon from '/public/svg/club.svg';
import ContactsIcon from '/public/svg/contacts.svg';
import DashboardIcon from '/public/svg/dashboard.svg';
import MembersIcon from '/public/svg/members.svg';
import StatementsIcon from '/public/svg/statements.svg';
import ReceiptesIcon from '/public/svg/receiptes.svg';
import DivisionsIcon from '/public/svg/divisions.svg';
import MembershipTypeIcon from '/public/svg/membership_type.svg';
import TaxAccountsIcon from '/public/svg/tax_accounts.svg';
import UsersIcon from '/public/svg/users.svg';
import Menu from './Menu';
import MembershipsFilledIcon from '/public/svg/memberships_filled.svg';
import ClubFilledIcon from '/public/svg/club_filled.svg';
import ContactsFilledIcon from '/public/svg/contacts_filled.svg';
import DashboardFilledIcon from '/public/svg/dashboard_filled.svg';
import MembersFilledIcon from '/public/svg/members_filled.svg';
import StatementsFilledIcon from '/public/svg/statements_filled.svg';
import ReceiptesFilledIcon from '/public/svg/receiptes_filled.svg';
import DivisionsFilledIcon from '/public/svg/divisions_filled.svg';
import MembershipTypeFilledIcon from '/public/svg/membership_type_filled.svg';
import TaxAccountsFilledIcon from '/public/svg/tax_accounts_filled.svg';
import UsersFilledIcon from '/public/svg/users_filled.svg';

export default async function Navigation() {
    const { t } = createTranslation();
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    const [club] = await getOne<Club>('clubs', session.club_id, {});

    const items = [
        {
            title: t('admin:general'),
            items: [
                {
                    href: '/admin/dashboard',
                    title: t('admin:dashboard'),
                    icon: <DashboardIcon />,
                    activeIcon: <DashboardFilledIcon />,
                },
                {
                    href: '/admin/members',
                    title: t('member:title.other'),
                    icon: <MembersIcon />,
                    activeIcon: <MembersFilledIcon />,
                },
                {
                    href: '/admin/memberships',
                    title: t('membership:title.other'),
                    icon: <MembershipsIcon />,
                    activeIcon: <MembershipsFilledIcon />,
                },
            ],
        },
        {
            title: t('admin:finances'),
            items: [
                {
                    href: '/admin/finances/statements',
                    title: t('statement:title.other'),
                    icon: <StatementsIcon />,
                    activeIcon: <StatementsFilledIcon />,
                },
                {
                    href: '/admin/finances/receipts',
                    title: t('receipt:title.other'),
                    icon: <ReceiptesIcon />,
                    activeIcon: <ReceiptesFilledIcon />,
                },
                {
                    href: '/admin/finances/contacts',
                    title: t('admin:contacts'),
                    icon: <ContactsIcon />,
                    activeIcon: <ContactsFilledIcon />,
                },
            ],
        },
        {
            title: t('admin:settings'),
            items: [
                {
                    href: '/admin/club',
                    title: t('club:title.one'),
                    icon: <ClubIcon />,
                    activeIcon: <ClubFilledIcon />,
                },
                {
                    href: '/admin/divisions',
                    title: t('division:title.other'),
                    icon: <DivisionsIcon />,
                    activeIcon: <DivisionsFilledIcon />,
                },
                {
                    href: '/admin/membership-types',
                    title: t('membership_type:title.other'),
                    icon: <MembershipTypeIcon />,
                    activeIcon: <MembershipTypeFilledIcon />,
                },
                {
                    href: '/admin/tax-accounts',
                    title: t('tax_account:title.other'),
                    icon: <TaxAccountsIcon />,
                    activeIcon: <TaxAccountsFilledIcon />,
                },
                {
                    href: '/admin/users',
                    title: t('user:title.other'),
                    icon: <UsersIcon />,
                    activeIcon: <UsersFilledIcon />,
                },
            ],
        },
    ];

    return (
        <Menu
            items={items}
            clubLogoUrl={club?.logoUrl}
            clubTitle={club?.title}
        />
    );
}
