interface AccountsLayoutProps {
    children: React.ReactNode;
}

export default async function AccountsLayout({
    children,
}: AccountsLayoutProps) {
    return <div className="flex flex-col md:flex-row">{children}</div>;
}
