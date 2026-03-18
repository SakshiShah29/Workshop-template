import type { Metadata } from 'next';
import { Space_Grotesk, DM_Mono } from 'next/font/google';
import { Web3Provider } from '@/providers/Web3Provider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    weight: ['400', '500', '600', '700'],
});

const dmMono = DM_Mono({
    subsets: ['latin'],
    variable: '--font-dm-mono',
    weight: ['400', '500'],
});

export const metadata: Metadata = {
    title: 'ChainBeasts — Anime NFT Evolution',
    description: 'Mint and evolve anime beast NFTs with $POWER tokens on Ethereum Sepolia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${dmMono.variable}`}>
                <Web3Provider>
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}
