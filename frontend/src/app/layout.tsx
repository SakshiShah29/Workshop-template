import type { Metadata } from 'next';
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import { Web3Provider } from '@/providers/Web3Provider';
import './globals.css';

const syne = Syne({
    subsets: ['latin'],
    variable: '--font-syne',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
    title: 'ChainBeasts — Anime NFT Evolution',
    description: 'Mint and evolve anime beast NFTs with $POWER tokens',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} scanlines`}>
                <Web3Provider>
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}
