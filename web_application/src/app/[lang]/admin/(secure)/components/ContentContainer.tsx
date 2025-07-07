import Footer from '@/app/components/Footer';
import MadeWith from '@/app/components/MadeWith';
import React, { PropsWithChildren } from 'react';

export default function ContentContainer({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-1 flex-col items-center justify-between">
            <main className="flex w-full flex-1 flex-col px-4 md:px-6">
                {children}
            </main>

            <Footer className="flex flex-col items-center justify-center">
                <div className="mb-4">
                    <MadeWith />
                </div>
            </Footer>
        </div>
    );
}
