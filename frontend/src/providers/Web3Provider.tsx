'use client';

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={{
                    ...lightTheme({
                        borderRadius: 'none',
                        fontStack: 'system',
                    }),
                    colors: {
                        ...lightTheme().colors,
                        accentColor: '#FDE68A',
                        accentColorForeground: '#000000',
                        connectButtonBackground: '#FDE68A',
                        connectButtonText: '#000000',
                    },
                    shadows: {
                        ...lightTheme().shadows,
                        connectButton: '4px 4px 0px #000',
                    },
                }}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
