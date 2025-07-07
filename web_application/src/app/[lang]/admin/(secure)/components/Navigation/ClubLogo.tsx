import { getCurrentClub } from '@/actions/clubs/getCurrent';
import Link from 'next/link';
import Title from './Title';

export default async function ClubLogo() {
    const club = await getCurrentClub();

    return (
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
    );
}
