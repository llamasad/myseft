'use client';

import StaticLink from '@/components/navigation/staic-link';
import classNames from 'classnames';
import { Jockey_One } from 'next/font/google';
const jockeyOne = Jockey_One({ weight: '400', preload: false });

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="pt-16 flex h-full items-center justify-center">
            <div className="text-center mr-2 p-2 border-r border-weak">
                <p className={classNames(' text-tl mb-2 text-3xl font-medium', jockeyOne.className)}>TManager</p>
                <p className="text-lg text-tl font-semibold">403</p>
            </div>
            <div>
                <h2 className="text-center mb-2">Forbiden,login before access</h2>
                <p className="text-center  text-weak mb-2">
                    <span
                        className="text-green-500"
                        onClick={() => {
                            reset();
                        }}
                    >
                        reset
                    </span>{' '}
                    if you logged
                </p>
                <StaticLink
                    isHighlight={false}
                    href="/showcase/product/task-manager"
                    className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                >
                    Back to home
                </StaticLink>
            </div>
        </main>
    );
}
