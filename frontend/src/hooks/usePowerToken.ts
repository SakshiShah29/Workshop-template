'use client';

import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { POWER_TOKEN_ADDRESS, POWER_TOKEN_ABI, CHAIN_BEASTS_ADDRESS } from '@/config/contracts';

// ═══════════════════════════════════════════════
// TODO 1: Read the user's $POWER balance
// ═══════════════════════════════════════════════
// Hook: useReadContract
// Contract: POWER_TOKEN_ADDRESS
// ABI: POWER_TOKEN_ABI
// Function: 'balanceOf'
// Arg: the connected wallet address
// Only enable when wallet is connected (query.enabled)
//
// This is a READ — no gas, no MetaMask popup.
// The component will use: const { data: balance } = usePowerBalance()
// ═══════════════════════════════════════════════
export function usePowerBalance() {
    const { address } = useAccount();

    // YOUR CODE HERE

}

// ═══════════════════════════════════════════════
// TODO 2: Approve $POWER spending for ChainBeasts
// ═══════════════════════════════════════════════
// Hook: useWriteContract
// This is a WRITE — costs gas, triggers MetaMask popup.
//
// The component will destructure and call it like:
//   const { writeContract: approve, isPending: isApproving } = useApprovePower();
//   approve({
//     address: POWER_TOKEN_ADDRESS,
//     abi: POWER_TOKEN_ABI,
//     functionName: 'approve',
//     args: [CHAIN_BEASTS_ADDRESS, parseEther('100')],
//   });
//
// Notice: the hook just returns useWriteContract().
// The CALLING code decides what function to call and with what args.
// This is how wagmi works — useWriteContract is generic,
// the specifics are passed when you call writeContract().
// ═══════════════════════════════════════════════
export function useApprovePower() {

    // YOUR CODE HERE

}

// ─── Do not edit below ───────────────────────────────────────────────────────
// This is used internally to check existing allowance before minting.
export function usePowerAllowance(spender: `0x${string}`) {
    const { address } = useAccount();
    return useReadContract({
        address: POWER_TOKEN_ADDRESS as `0x${string}`,
        abi: POWER_TOKEN_ABI,
        functionName: 'allowance',
        args: address ? [address, spender] : undefined,
        query: { enabled: !!address },
    });
}

