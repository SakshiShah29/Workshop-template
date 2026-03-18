'use client';

import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CHAIN_BEASTS_ADDRESS, CHAIN_BEASTS_ABI } from '@/config/contracts';

// ═══════════════════════════════════════════════
// TODO 3: Read all beast tokenIds owned by the user
// ═══════════════════════════════════════════════
// Hook: useReadContract
// Contract: CHAIN_BEASTS_ADDRESS
// ABI: CHAIN_BEASTS_ABI
// Function: 'getOwnedTokens'
// Arg: the connected wallet address
// Returns: uint256[] — an array of tokenIds
//
// Same pattern as TODO 1, different contract and function.
// The gallery component uses this to know which beast cards to render.
// ═══════════════════════════════════════════════
export function useOwnedBeasts() {
    const { address } = useAccount();

    // YOUR CODE HERE

}

// ═══════════════════════════════════════════════
// TODO 4: Read the current stage of a specific beast
// ═══════════════════════════════════════════════
// Hook: useReadContract
// Contract: CHAIN_BEASTS_ADDRESS
// ABI: CHAIN_BEASTS_ABI
// Function: 'beastStage'
// Arg: tokenId (bigint) — which beast to check
// Returns: uint8 — the stage number (1, 2, or 3)
//
// Unlike TODO 1 and 3, this takes a tokenId parameter
// instead of the wallet address. Each beast card calls
// this hook with its own tokenId.
// ═══════════════════════════════════════════════
export function useBeastStage(tokenId: bigint) {

    // YOUR CODE HERE

}

// ═══════════════════════════════════════════════
// TODO 5: Mint a new beast
// ═══════════════════════════════════════════════
// Hook: useWriteContract
// Same pattern as TODO 2.
//
// The component will call it like:
//   const { writeContract: mint, isPending: isMinting } = useMintBeast();
//   mint({
//     address: CHAIN_BEASTS_ADDRESS,
//     abi: CHAIN_BEASTS_ABI,
//     functionName: 'mintBeast',
//   });
//
// No args — mintBeast() takes no parameters.
// But the user MUST have approved $POWER first (TODO 2).
// ═══════════════════════════════════════════════
export function useMintBeast() {

    // YOUR CODE HERE

}

// ═══════════════════════════════════════════════
// TODO 6: Evolve a beast to the next stage
// ═══════════════════════════════════════════════
// Hook: useWriteContract
// Same pattern as TODO 2 and 5.
//
// The component will call it like:
//   const { writeContract: evolve, isPending: isEvolving } = useEvolveBeast();
//   evolve({
//     address: CHAIN_BEASTS_ADDRESS,
//     abi: CHAIN_BEASTS_ABI,
//     functionName: 'evolve',
//     args: [tokenId],
//   });
//
// This time there IS an arg — the tokenId of the beast to evolve.
// And the user must have approved $POWER for the evolve cost first.
// ═══════════════════════════════════════════════
export function useEvolveBeast() {

    // YOUR CODE HERE

}
