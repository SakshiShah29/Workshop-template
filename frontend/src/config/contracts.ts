// ============================================
// DEPLOYED CONTRACT ADDRESSES (Ethereum Sepolia)
// ============================================
export const POWER_TOKEN_ADDRESS = '' as const;
export const CHAIN_BEASTS_ADDRESS = '' as const;

// Pinata Gateway for IPFS images
export const PINATA_GATEWAY = 'https://apricot-immense-carp-804.mypinata.cloud/ipfs';

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
    {
        name: 'symbol',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
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
