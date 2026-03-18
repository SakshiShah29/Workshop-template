'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Header } from '@/components/Header';
import { MintPanel } from '@/components/MintPanel';
import { BeastGallery } from '@/components/BeastGallery';

export default function Home() {
    const { isConnected } = useAccount();

    return (
        <main className="min-h-screen bg-bg-page">
            <Header />

            {!isConnected ? (
                /* ── Connect Wallet Screen ── */
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="neo-card max-w-sm w-full text-center space-y-6"
                        style={{ transform: 'rotate(-1deg)' }}
                    >
                        <h2
                            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                            className="text-3xl font-bold"
                        >
                            CHAINBEASTS
                        </h2>
                        <p
                            style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                            className="text-sm text-gray-500 uppercase tracking-widest"
                        >
                            MINT. BURN. EVOLVE.
                        </p>
                        <div className="border-t-2 border-black pt-4 flex flex-col items-center gap-4">
                            <p
                                style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                                className="text-xs uppercase tracking-widest text-gray-500"
                            >
                                CONNECT WALLET TO BEGIN
                            </p>
                            <ConnectButton />
                        </div>
                    </motion.div>
                </div>
            ) : (
                /* ── Main App ── */
                <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 space-y-10">
                    {/* Mint Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <MintPanel />
                    </motion.div>

                    {/* Divider with sticker badge */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-0.5 bg-black" />
                        <span className="sticker bg-card-yellow" style={{ transform: 'rotate(-1deg)' }}>
                            YOUR COLLECTION
                        </span>
                        <div className="flex-1 h-0.5 bg-black" />
                    </div>

                    {/* Beast Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <BeastGallery />
                    </motion.div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t-2 border-black mt-20 py-6 text-center bg-black">
                <p
                    style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                    className="text-xs text-white uppercase tracking-widest"
                >
                    Built at CHARUSAT Workshop 2026
                </p>
            </footer>
        </main>
    );
}
