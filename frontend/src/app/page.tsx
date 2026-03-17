'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { formatEther, parseEther } from 'viem';
import {
    POWER_TOKEN_ADDRESS,
    POWER_TOKEN_ABI,
    CHAIN_BEASTS_ADDRESS,
    CHAIN_BEASTS_ABI,
} from '@/config/contracts';
import { useState } from 'react';
import Image from 'next/image';

const STAGE_IMAGES = ['', '/beasts/beast1.png', '/beasts/beast2.png', '/beasts/beast3.png'];
const STAGE_NAMES = ['', 'Rookie', 'Warrior', 'Legendary'];

function stageColor(s: number) {
    return s === 3 ? 'text-accent-4' : s === 2 ? 'text-accent-2' : 'text-accent';
}
function stageBorder(s: number) {
    return s === 3 ? 'border-accent-4/40' : s === 2 ? 'border-accent-2/40' : 'border-accent/40';
}
function stageGlow(s: number) {
    return s === 3 ? 'glow-emerald' : s === 2 ? 'glow-violet' : 'glow-cyan';
}

// ── Main ─────────────────────────────────────────

export default function Home() {
    const { address, isConnected } = useAccount();
    const config = useConfig();
    const { writeContractAsync } = useWriteContract();

    const { data: powerBalance, refetch: refetchBalance } = useReadContract({
        address: POWER_TOKEN_ADDRESS,
        abi: POWER_TOKEN_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const { data: ownedTokens, refetch: refetchTokens } = useReadContract({
        address: CHAIN_BEASTS_ADDRESS,
        abi: CHAIN_BEASTS_ABI,
        functionName: 'getOwnedTokens',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const [mintStatus, setMintStatus] = useState<'idle' | 'approving' | 'minting' | 'success'>('idle');

    const handleMint = async () => {
        try {
            setMintStatus('approving');
            const approveHash = await writeContractAsync({
                address: POWER_TOKEN_ADDRESS,
                abi: POWER_TOKEN_ABI,
                functionName: 'approve',
                args: [CHAIN_BEASTS_ADDRESS, parseEther('100')],
            });
            await waitForTransactionReceipt(config, { hash: approveHash });

            setMintStatus('minting');
            const mintHash = await writeContractAsync({
                address: CHAIN_BEASTS_ADDRESS,
                abi: CHAIN_BEASTS_ABI,
                functionName: 'mintBeast',
            });
            await waitForTransactionReceipt(config, { hash: mintHash });

            setMintStatus('success');
            refetchBalance();
            refetchTokens();
            setTimeout(() => setMintStatus('idle'), 3000);
        } catch (error) {
            console.error('Mint failed:', error);
            setMintStatus('idle');
        }
    };

    const refetchAll = () => { refetchBalance(); refetchTokens(); };

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-dark/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="font-display text-xl font-bold tracking-tight text-gradient select-none">
                        CHAINBEASTS
                    </h1>
                    <ConnectButton />
                </div>
            </header>

            {/* Ticker */}
            <div className="border-b border-white/[0.04] bg-accent/[0.03] overflow-hidden py-1">
                <div className="animate-marquee whitespace-nowrap font-mono text-[10px] tracking-widest text-accent/40 uppercase">
                    {Array(3).fill(null).map((_, i) => (
                        <span key={i}>
                            <span className="mx-5">mint beasts</span>
                            <span className="mx-5 text-white/10">/</span>
                            <span className="mx-5">burn $power</span>
                            <span className="mx-5 text-white/10">/</span>
                            <span className="mx-5">evolve to legendary</span>
                            <span className="mx-5 text-white/10">/</span>
                            <span className="mx-5">3 stages</span>
                            <span className="mx-5 text-white/10">/</span>
                        </span>
                    ))}
                </div>
            </div>

            {!isConnected ? <Landing /> : (
                <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 space-y-10">
                    {/* Balance */}
                    <div className="gradient-border glow-cyan rounded-xl p-6 transition-all">
                        <p className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase mb-1">
                            Power Balance
                        </p>
                        <p className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient">
                            {powerBalance ? Number(formatEther(powerBalance as bigint)).toLocaleString() : '0'}
                            <span className="text-xl text-zinc-500 ml-3 font-body font-normal">$POWER</span>
                        </p>
                    </div>

                    {/* Mint */}
                    <div className="gradient-border glow-pink rounded-xl p-6 transition-all">
                        <SectionHeader label="Mint Beast" />
                        <div className="flex flex-col md:flex-row gap-8 items-center mt-6">
                            <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-dark shrink-0 group">
                                <Image
                                    src="/beasts/beast1.png"
                                    alt="Rookie"
                                    width={240}
                                    height={240}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="font-display text-2xl font-bold tracking-tight">Rookie Form</p>
                                    <p className="text-zinc-500 mt-1">
                                        Stage 1 &middot; <span className="text-accent-3">100 $POWER</span>
                                    </p>
                                </div>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                                    Approve and mint in one click. Your beast starts at Stage 1 and can evolve twice.
                                </p>
                                <button
                                    onClick={handleMint}
                                    disabled={mintStatus !== 'idle'}
                                    className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-accent-3/10 border border-accent-3/30 text-accent-3 font-display text-sm font-semibold tracking-wide uppercase transition-all hover:bg-accent-3/20 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent-3/10 disabled:hover:shadow-none"
                                >
                                    {mintStatus === 'idle' && 'Mint Beast'}
                                    {mintStatus === 'approving' && (
                                        <><Spinner /> Approving...</>
                                    )}
                                    {mintStatus === 'minting' && (
                                        <><Spinner /> Minting...</>
                                    )}
                                    {mintStatus === 'success' && 'Minted!'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div>
                        <SectionHeader label="Your Beasts" />
                        {ownedTokens && (ownedTokens as bigint[]).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {(ownedTokens as bigint[]).map((tokenId) => (
                                    <BeastCard key={tokenId.toString()} tokenId={tokenId} onAction={refetchAll} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-xl border border-dashed border-white/[0.08] p-12 text-center">
                                <p className="text-zinc-600 text-sm">No beasts yet — mint your first one above</p>
                            </div>
                        )}
                    </div>

                    {/* Evolution Path */}
                    <EvolutionShowcase />
                </div>
            )}
        </main>
    );
}

// ── Landing ──────────────────────────────────────

function Landing() {
    return (
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-24 space-y-24">
            <div className="text-center space-y-6">
                <p className="font-mono text-[11px] tracking-[0.3em] text-zinc-600 uppercase">
                    NFT Evolution Protocol
                </p>
                <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
                    <span className="text-gradient">Mint. Evolve.</span>{' '}
                    <span className="text-gradient-pink">Conquer.</span>
                </h2>
                <p className="text-zinc-500 text-lg max-w-lg mx-auto leading-relaxed">
                    Anime beast NFTs powered by <span className="text-accent">$POWER</span> tokens on Ethereum Sepolia
                </p>
            </div>

            <EvolutionShowcase />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { n: '01', title: 'Get $POWER', body: 'Receive tokens from the instructor airdrop. These fuel minting and evolution.', color: 'text-accent', glow: 'glow-cyan' },
                    { n: '02', title: 'Mint Beasts', body: 'Spend 100 $POWER to mint a Rookie beast. Each one starts at Stage 1.', color: 'text-accent-2', glow: 'glow-violet' },
                    { n: '03', title: 'Evolve', body: 'Burn $POWER to evolve through 3 stages. Reach Legendary for max power.', color: 'text-accent-4', glow: 'glow-emerald' },
                ].map((s) => (
                    <div key={s.n} className={`gradient-border ${s.glow} rounded-xl p-6 transition-all`}>
                        <p className={`font-display text-3xl font-bold ${s.color} mb-3`}>{s.n}</p>
                        <h3 className="font-display text-base font-semibold tracking-tight mb-2">{s.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{s.body}</p>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <p className="text-zinc-600 text-sm">Connect your wallet above to begin</p>
            </div>
        </div>
    );
}

// ── Evolution Showcase ───────────────────────────

function EvolutionShowcase() {
    return (
        <div className="gradient-border rounded-xl p-6 md:p-8">
            <SectionHeader label="Evolution Path" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mt-8">
                {[1, 2, 3].map((stage) => (
                    <div key={stage} className="flex items-center gap-0">
                        <div className={`rounded-lg border ${stageBorder(stage)} bg-card p-3 ${stageGlow(stage)} transition-all hover:-translate-y-1 duration-300`}>
                            <div className="rounded-md overflow-hidden border border-white/[0.06] bg-dark">
                                <Image
                                    src={STAGE_IMAGES[stage]}
                                    alt={STAGE_NAMES[stage]}
                                    width={180}
                                    height={180}
                                    className="object-cover"
                                />
                            </div>
                            <div className="mt-3 text-center">
                                <p className={`font-mono text-[10px] tracking-widest ${stageColor(stage)} uppercase`}>
                                    Stage {stage}
                                </p>
                                <p className="text-zinc-300 text-sm font-display font-semibold mt-0.5">
                                    {STAGE_NAMES[stage]}
                                </p>
                            </div>
                        </div>
                        {stage < 3 && (
                            <div className="hidden md:flex flex-col items-center mx-4 gap-0.5">
                                <span className="text-zinc-600 text-lg">&rarr;</span>
                                <span className="font-mono text-[9px] text-zinc-600">
                                    {stage === 1 ? '250' : '500'} PWR
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Beast Card ───────────────────────────────────

function BeastCard({ tokenId, onAction }: { tokenId: bigint; onAction: () => void }) {
    const config = useConfig();
    const { writeContractAsync } = useWriteContract();
    const { data: stage, refetch: refetchStage } = useReadContract({
        address: CHAIN_BEASTS_ADDRESS,
        abi: CHAIN_BEASTS_ABI,
        functionName: 'beastStage',
        args: [tokenId],
    });

    const [status, setStatus] = useState<'idle' | 'approving' | 'evolving' | 'success'>('idle');
    const s = Number(stage || 1);

    const handleEvolve = async () => {
        try {
            const cost = s === 1 ? parseEther('250') : parseEther('500');
            setStatus('approving');
            const ah = await writeContractAsync({
                address: POWER_TOKEN_ADDRESS, abi: POWER_TOKEN_ABI,
                functionName: 'approve', args: [CHAIN_BEASTS_ADDRESS, cost],
            });
            await waitForTransactionReceipt(config, { hash: ah });

            setStatus('evolving');
            const eh = await writeContractAsync({
                address: CHAIN_BEASTS_ADDRESS, abi: CHAIN_BEASTS_ABI,
                functionName: 'evolve', args: [tokenId],
            });
            await waitForTransactionReceipt(config, { hash: eh });

            setStatus('success');
            refetchStage();
            onAction();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (e) {
            console.error('Evolve failed:', e);
            setStatus('idle');
        }
    };

    return (
        <div className={`gradient-border ${stageGlow(s)} rounded-xl p-4 transition-all`}>
            <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[11px] tracking-wider text-zinc-500">
                    #{tokenId.toString().padStart(3, '0')}
                </span>
                <span className={`font-mono text-[10px] tracking-widest px-2 py-0.5 rounded border ${stageBorder(s)} ${stageColor(s)}`}>
                    STG {s}
                </span>
            </div>

            <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-dark mb-4 group">
                <Image
                    src={STAGE_IMAGES[s]}
                    alt={STAGE_NAMES[s]}
                    width={400}
                    height={400}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            <p className={`font-display text-lg font-bold tracking-tight mb-4 ${stageColor(s)}`}>
                {STAGE_NAMES[s]}
            </p>

            {s < 3 ? (
                <button
                    onClick={handleEvolve}
                    disabled={status !== 'idle'}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-display font-semibold tracking-wide uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        s === 1
                            ? 'bg-accent-2/10 border border-accent-2/30 text-accent-2 hover:bg-accent-2/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]'
                            : 'bg-accent-4/10 border border-accent-4/30 text-accent-4 hover:bg-accent-4/20 hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]'
                    } disabled:hover:bg-transparent disabled:hover:shadow-none`}
                >
                    {status === 'idle' && `Evolve → Stage ${s + 1} · ${s === 1 ? '250' : '500'} PWR`}
                    {status === 'approving' && <><Spinner /> Approving...</>}
                    {status === 'evolving' && <><Spinner /> Evolving...</>}
                    {status === 'success' && 'Evolved!'}
                </button>
            ) : (
                <div className="rounded-lg border border-accent-4/30 bg-accent-4/10 text-center py-3">
                    <span className="font-display text-sm font-semibold tracking-wide text-accent-4 uppercase">
                        Max Evolution
                    </span>
                </div>
            )}
        </div>
    );
}

// ── Shared ───────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent to-accent-2" />
            <h2 className="font-display text-sm font-semibold tracking-wide uppercase text-zinc-300">
                {label}
            </h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}
