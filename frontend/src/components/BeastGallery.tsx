'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useOwnedBeasts } from '@/hooks/useChainBeasts';
import { BeastCard } from './BeastCard';

export function BeastGallery() {
    const { data: ownedTokens } = useOwnedBeasts() ?? {};
    const tokens = (ownedTokens as bigint[]) ?? [];

    return (
        <section>
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
                <h2
                    style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                    className="text-xl font-bold uppercase"
                >
                    Your Beasts
                </h2>
                <span className="sticker bg-card-yellow">{tokens.length}</span>
                <div className="flex-1 h-[2px] bg-black" />
            </div>

            {tokens.length === 0 ? (
                /* Empty state */
                <div className="neo-card text-center py-12">
                    <motion.p
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                        className="uppercase tracking-widest text-gray-500"
                    >
                        NO BEASTS YET. MINT YOUR FIRST.
                    </motion.p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {tokens.map((tokenId, index) => (
                            <motion.div
                                key={tokenId.toString()}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                    delay: index * 0.05,
                                }}
                                layout
                            >
                                <BeastCard tokenId={tokenId} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
