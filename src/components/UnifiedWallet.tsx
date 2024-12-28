/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import * as AllWalletAdapters from '@solana/wallet-adapter-wallets';

import { WalletName } from '@solana/wallet-adapter-base';
export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';

import { createWallet } from '@passkeys/core';

export const metadata = {
    name: 'UnifiedWallet',
    description: 'UnifiedWallet',
    url: 'https://jup.ag',
    iconUrls: ['https://jup.ag/favicon.ico'],
    additionalInfo: ''
}

export default function UnifiedWallet() {
    const wallets = useMemo(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        const wallet = createWallet({
            appId: '4a1e553e-ca97-46d5-9666-0993490d4aaa', // Only required for production, contact us to get yours.
            providers: {
                solana: true,
            },
        });

        const { UnsafeBurnerWalletAdapter: allwalletAdapters } = AllWalletAdapters;

        const walletAdapters = Object.keys(allwalletAdapters)
            .filter((key) => key.includes('Adapter'))
            .map((key) => (allwalletAdapters as any)[key])
            .map((WalletAdapter: any) => new WalletAdapter()); // Intentional any, TS were being annoying

        return [wallet, ...walletAdapters].filter((item) => item && item.name && item.icon);
    }, [metadata]);

    const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'> = useMemo(
        () => ({
            wallets: wallets,
            config: {
                autoConnect: false,
                env: 'mainnet-beta',
                metadata: {
                    name: 'UnifiedWallet',
                    description: 'UnifiedWallet',
                    url: 'https://jup.ag',
                    iconUrls: ['https://jup.ag/favicon.ico'],
                },
                // notificationCallback: WalletNotification,
                walletPrecedence: ['OKX Wallet' as WalletName, 'WalletConnect' as WalletName],
                walletlistExplanation: {
                    href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
                },
            },
        }),
        [wallets],
    );

    return (
        <div tw="flex flex-col items-start">
            <UnifiedWalletProvider {...params}>
                <UnifiedWalletButton />
            </UnifiedWalletProvider>
        </div>
    );
};

