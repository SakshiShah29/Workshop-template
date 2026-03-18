'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { parseEther } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useApprovePower } from '@/hooks/usePowerToken';
import { useBeastStage, useEvolveBeast } from '@/hooks/useChainBeasts';
import {
    CHAIN_BEASTS_ADDRESS,
    CHAIN_BEASTS_ABI,
    POWER_TOKEN_ADDRESS,
    POWER_TOKEN_ABI,
} from '@/config/contracts';

const STAGE_NAMES = ['', 'ROOKIE FORM', 'WARRIOR FORM', 'LEGENDARY FORM'];
const STAGE_POWER = ['', '100', '500', '1000'];
// Neo-brutalist stage card backgrounds
const STAGE_BG = ['', '#86EFAC', '#93C5FD', '#FCD34D'];
const STAGE_FLASH = ['', '#86EFAC', '#93C5FD', '#FCD34D'];

type EvolveStatus = 'idle' | 'approving' | 'evolving' | 'success';

export function BeastCard({ tokenId }: { tokenId: bigint }) {
    const queryClient = useQueryClient();

    // Hooks wired to the contract — students implement these in Session 9
    const { data: stageData } = useBeastStage(tokenId) ?? {};
    const { writeContract: approveEvolve, isPending: isApproving } = useApprovePower() ?? {};
    const { writeContract: evolve, isPending: isEvolving } = useEvolveBeast() ?? {};

    const [displayStage, setDisplayStage] = useState(1);
    const [evolveStatus, setEvolveStatus] = useState<EvolveStatus>('idle');
    const [showFlash, setShowFlash] = useState(false);

    // Sync displayStage with on-chain data
    useEffect(() => {
        if (stageData !== undefined) {
            setDisplayStage(Number(stageData));
        }
    }, [stageData]);

    const handleEvolve = () => {
        const cost = displayStage === 1 ? parseEther('250') : parseEther('500');

        // Step 1: Approve $POWER burn (burnFrom requires allowance)
        setEvolveStatus('approving');
        approveEvolve?.({
            address: POWER_TOKEN_ADDRESS,
            abi: POWER_TOKEN_ABI,
            functionName: 'approve',
            args: [CHAIN_BEASTS_ADDRESS, cost],
        }, {
            onSuccess: () => {
                // Step 2: Evolve the beast
                setEvolveStatus('evolving');
                evolve?.({
                    address: CHAIN_BEASTS_ADDRESS,
                    abi: CHAIN_BEASTS_ABI,
                    functionName: 'evolve',
                    args: [tokenId],
                }, {
                    onSuccess: () => {
                        // Step 3: Flash → swap image → refresh
                        setShowFlash(true);
                        setTimeout(() => {
                            setDisplayStage((prev) => prev + 1);
                            setShowFlash(false);
                            setEvolveStatus('success');
                            queryClient.invalidateQueries();
                            setTimeout(() => setEvolveStatus('idle'), 2500);
                        }, 400);
                    },
                    onError: () => setEvolveStatus('idle'),
                });
            },
            onError: () => setEvolveStatus('idle'),
        });
    };

    const busy = isApproving || isEvolving || evolveStatus === 'approving' || evolveStatus === 'evolving';
    const s = displayStage;
    const cardBg = STAGE_BG[s] ?? '#86EFAC';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="relative p-4 overflow-hidden border-2 border-black"
            style={{ background: cardBg, boxShadow: '4px 4px 0px #000', transition: 'background 0.3s' }}
        >
            {/* Color flash overlay during evolution */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{ background: STAGE_FLASH[s + 1] ?? '#fff' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
            </AnimatePresence>

            {/* Token ID + Stage sticker */}
            <div className="flex justify-between items-center mb-3">
                <span
                    style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                    className="text-[11px] tracking-wider text-gray-600"
                >
                    #{tokenId.toString().padStart(3, '0')}
                </span>
                <span className="sticker bg-white">STAGE {s}</span>
            </div>

            {/* Beast Image — AnimatePresence drives the evolution animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={displayStage}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 200, damping: 20 },
                    }}
                    exit={{
                        scale: 0.5,
                        opacity: 0,
                        rotate: -10,
                        filter: 'brightness(2)',
                        transition: { duration: 0.35 },
                    }}
                    className="beast-image-frame mb-4"
                >
                    <Image
                        src={`/beasts/beast${s}.png`}
                        alt={STAGE_NAMES[s]}
                        width={400}
                        height={400}
                        className="w-full object-cover block"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Beast name */}
            <p
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                className="font-bold text-lg mb-3"
            >
                {STAGE_NAMES[s]}
            </p>

            {/* Power level stat box */}
            <div className="stat-box mb-4">
                <div className="number">{STAGE_POWER[s]}</div>
                <div className="label">Power Level</div>
            </div>

            {/* Evolve section or MAX EVOLUTION badge */}
            {s < 3 ? (
                <div className="space-y-2">
                    {/* Transaction status */}
                    <AnimatePresence mode="wait">
                        {evolveStatus !== 'idle' && (
                            <motion.p
                                key={evolveStatus}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
                                className={`text-[11px] uppercase tracking-widest ${
                                    evolveStatus === 'success' ? 'text-green-700' : 'text-gray-600'
                                }`}
                            >
                                {evolveStatus === 'approving' && '[ APPROVING... ]'}
                                {evolveStatus === 'evolving' && '[ EVOLVING... ]'}
                                {evolveStatus === 'success' && '[ EVOLVED! ✓ ]'}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleEvolve}
                        disabled={busy}
                        className={`w-full neo-button ${s === 1 ? 'neo-button-blue' : 'neo-button-orange'} disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                        {busy
                            ? evolveStatus === 'approving' ? 'APPROVING...' : 'EVOLVING...'
                            : `EVOLVE → STAGE ${s + 1} · ${s === 1 ? '250' : '500'} $PWR`}
                    </button>
                </div>
            ) : (
                <div
                    className="text-center py-3 border-2 border-black"
                    style={{ background: '#FCD34D' }}
                >
                    <span
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                        className="font-bold text-sm tracking-wide uppercase"
                    >
                        ★ MAX EVOLUTION ★
                    </span>
                </div>
            )}
        </motion.div>
    );
}
