// ============================================
// DEPLOYED CONTRACT ADDRESSES (Ethereum Sepolia)
// ============================================
export const POWER_TOKEN_ADDRESS = '0x38bfb6ccd9360a07894db6d215e842098be92efb' as const;
export const CHAIN_BEASTS_ADDRESS = '0x806322a98a3a1c131e4409f5f3de08c247255eb7' as const;

// Minimal ABIs — only the functions the frontend needs
export const POWER_TOKEN_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;

export const CHAIN_BEASTS_ABI = [
    {
        name: 'mintBeast',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'evolve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'beastStage',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint8' }],
    },
    {
        name: 'tokenURI',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{ name: '', type: 'string' }],
    },
    {
        name: 'getOwnedTokens',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner_', type: 'address' }],
        outputs: [{ name: '', type: 'uint256[]' }],
    },
    {
        name: 'getEvolveCost',
        type: 'function',
        stateMutability: 'pure',
        inputs: [{ name: 'currentStage', type: 'uint8' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'MINT_COST',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;
