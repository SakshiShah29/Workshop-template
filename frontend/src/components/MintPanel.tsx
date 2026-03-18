'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { parseEther } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useApprovePower } from '@/hooks/usePowerToken';
import { useMintBeast } from '@/hooks/useChainBeasts';
import {
    POWER_TOKEN_ADDRESS,
    POWER_TOKEN_ABI,
    CHAIN_BEASTS_ADDRESS,
    CHAIN_BEASTS_ABI,
} from '@/config/contracts';

export function MintPanel() {
    const queryClient = useQueryClient();
    const [approved, setApproved] = useState(false);

    // Hooks wired to the contract — students implement these in Session 9
    const { writeContract: approve, isPending: isApproving } = useApprovePower() ?? {};
    const { writeContract: mint, isPending: isMinting } = useMintBeast() ?? {};

    const handleApprove = () => {
        approve?.({
            address: POWER_TOKEN_ADDRESS,
            abi: POWER_TOKEN_ABI,
            functionName: 'approve',
            args: [CHAIN_BEASTS_ADDRESS, parseEther('100')],
        }, {
            onSuccess: () => setApproved(true),
        });
    };

    const handleMint = () => {
        mint?.({
            address: CHAIN_BEASTS_ADDRESS,
            abi: CHAIN_BEASTS_ABI,
            functionName: 'mintBeast',
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries();
                setApproved(false);
            },
        });
    };

    const busy = isApproving || isMinting;

    return (
        <section
            className="p-6 md:p-8 border-2 border-black"
            style={{ background: '#FDE68A', boxShadow: '4px 4px 0px #000' }}
        >
            {/* Section heading */}
            <h2
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                className="text-2xl font-bold mb-6 uppercase"
            >
                Mint Beast
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Beast Stage 1 Preview */}
                <div className="beast-image-frame shrink-0 w-70 md:w-75">
                    <Image
                        src="/beasts/beast1.png"
                        alt="Rookie Form — Stage 1"
                        width={300}
                        height={300}
                        className="block w-full"
                        priority
                    />
                </div>

                {/* Info + Actions */}
                <div className="flex-1 space-y-5">
                    {/* Stat boxes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="stat-box">
                            <div className="number">100</div>
                            <div className="label">$POWER cost</div>
                        </div>
                        <div className="stat-box">
                            <div className="number">1</div>
                            <div className="label">Stage / Rookie</div>
                        </div>
                    </div>

                    <p
                        style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                        className="text-sm text-gray-700 leading-relaxed"
                    >
                        Minting uses <strong>transferFrom</strong> — tokens move from your wallet to the contract as payment.
                        You need to <strong>approve</strong> first, then <strong>mint</strong>.
                    </p>

                    {/* Transaction status */}
                    <AnimatePresence mode="wait">
                        {(isApproving || isMinting || approved) && (
                            <motion.p
                                key={isApproving ? 'approving' : isMinting ? 'minting' : 'approved'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                                className={`text-xs uppercase tracking-widest ${
                                    approved && !isMinting ? 'text-green-700' : 'text-gray-600'
                                }`}
                            >
                                {isApproving && '[ APPROVING... ]'}
                                {approved && !isApproving && !isMinting && '[ APPROVED ✓ — NOW MINT ]'}
                                {isMinting && '[ MINTING... ]'}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Two-step buttons */}
                    <div className="flex gap-3 flex-wrap">
                        {/* Step 1: Approve */}
                        <button
                            onClick={handleApprove}
                            disabled={busy || approved}
                            className="neo-button flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isApproving ? 'APPROVING...' : approved ? 'APPROVED ✓' : 'APPROVE $POWER'}
                        </button>

                        {/* Step 2: Mint */}
                        <motion.button
                            onClick={handleMint}
                            disabled={!approved || busy}
                            animate={approved && !busy ? { opacity: [1, 0.85, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="neo-button neo-button-green flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isMinting ? 'MINTING...' : 'MINT BEAST'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
