import Link from 'next/link';

interface Props {
    logoUrl?: string;
    title?: string;
}

export default function ClubLogo({ logoUrl, title }: Props) {
    return (
        <Link href="/admin/dashboard" className="flex items-center">
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={`Logo ${title || 'Club'}`}
                    className="object-contain"
                    height={40}
                    width={36}
                />
            ) : (
                <div
                    className={`bg-blue-100 object-contain`}
                    style={{ width: '2rem' }}
                />
            )}
        </Link>
    );
}
