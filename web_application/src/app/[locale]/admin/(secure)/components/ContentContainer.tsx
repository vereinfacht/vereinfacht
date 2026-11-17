import Footer from '@/app/components/Footer';
import { PropsWithChildren } from 'react';
import TitleBar from './TitleBar';

export default function ContentContainer({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-1 flex-col items-center justify-between">
            <main className="grid w-full grid-cols-[1fr_auto] gap-x-4 px-4 md:px-6">
                <TitleBar />
                {children}
            </main>

            <Footer />
        </div>
    );
}
