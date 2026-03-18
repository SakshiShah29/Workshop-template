'use client';

import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { usePowerBalance } from '@/hooks/usePowerToken';

export function Header() {
    const { address } = useAccount();
    const { data: powerBalance } = usePowerBalance() ?? {};

    return (
        <header className="sticky top-0 z-40 bg-white border-b-[3px] border-black">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 gap-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <h1
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                        className="text-2xl font-bold tracking-tight"
                    >
                        CHAINBEASTS
                    </h1>
                    <span className="sticker bg-card-yellow hidden sm:inline-block">NFT</span>
                </div>

                {/* $POWER Balance */}
                {address && powerBalance !== undefined && (
                    <motion.div
                        key={powerBalance.toString()}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:flex flex-col items-center px-4 py-2 bg-card-purple border-2 border-black"
                        style={{ boxShadow: '2px 2px 0px #000' }}
                    >
                        <span
                            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                            className="text-xl font-bold leading-none"
                        >
                            {Number(formatEther(powerBalance as bigint)).toLocaleString()}
                        </span>
                        <span
                            style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                            className="text-[10px] uppercase tracking-widest text-gray-600 mt-0.5"
                        >
                            $POWER
                        </span>
                    </motion.div>
                )}

                {/* Connect Button */}
                <ConnectButton />
            </div>
        </header>
    );
}
