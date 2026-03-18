# ChainBeasts

An anime NFT evolution game built on Ethereum Sepolia. Mint beast NFTs by spending `$POWER` tokens, then evolve them through 3 stages by burning `$POWER`.

---

## How It Works

| Action | Cost | Token Pattern | Description |
|--------|------|---------------|-------------|
| Mint Beast | 100 $POWER | `transferFrom` (payment) | Tokens move from user → contract |
| Evolve to Stage 2 | 250 $POWER | `burnFrom` (destruction) | Tokens are permanently burned |
| Evolve to Stage 3 | 500 $POWER | `burnFrom` (destruction) | Tokens are permanently burned |

The key teaching moment: **mint uses `transferFrom`** (owner keeps the contract funded) while **evolve uses `burnFrom`** (deflationary mechanic — tokens cease to exist).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity 0.8.24, OpenZeppelin v5 |
| Development | Foundry (forge, cast, anvil) |
| Network | Ethereum Sepolia (testnet) |
| Metadata | IPFS via Pinata |
| Frontend | Next.js, wagmi v2, RainbowKit |

---

## Prerequisites

### 1. Foundry (forge, cast, anvil)

**macOS / Linux:**
```bash
curl -L https://foundry.paradigm.xyz | bash
```
Then **close and reopen your terminal**, or run:
```bash
source ~/.bashrc    # bash users
source ~/.zshrc     # zsh users (most macOS)
```
Then install the latest toolchain:
```bash
foundryup
```
Verify:
```bash
forge --version
# forge 0.x.x (...)
```

**Windows (WSL required):**

Foundry does not run natively on Windows. You need WSL (Windows Subsystem for Linux).

**Step 1 — Install WSL** (run in PowerShell or Command Prompt as Administrator):
```powershell
wsl --install
```
This installs WSL 2 with Ubuntu by default. Restart your computer when prompted.

**Step 2 — Open Ubuntu** from the Start menu. On first launch it will ask you to create a Unix username and password.

**Step 3 — Install Foundry inside WSL:**
```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

**Step 4 — Verify:**
```bash
forge --version
# forge 0.x.x (...)
```

> **WSL already installed?** If you have WSL but the `wsl --install` command fails, open Ubuntu directly from the Start menu and continue from Step 3.

> **Common issue:** If `foundryup: command not found` after install, run `source ~/.bashrc` and retry. If `forge: command not found` after `foundryup`, close and reopen the Ubuntu terminal.

---

### 2. Node.js v18+

Download from [nodejs.org](https://nodejs.org) or use a version manager:
```bash
# With nvm:
nvm install 18
nvm use 18
```

---

### 3. MetaMask + Ethereum Sepolia Network

Ethereum Sepolia is already built into MetaMask — just enable testnets:

**MetaMask → Settings → Advanced → Show test networks → ON**

Then select **Sepolia** from the network dropdown.

| Field | Value |
|-------|-------|
| Network Name | Sepolia |
| Chain ID | `11155111` |
| Currency Symbol | ETH |
| Block Explorer | `https://sepolia.etherscan.io` |

---

### 4. Get Sepolia ETH

You need testnet ETH to pay gas fees for deployment.

- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

---

### 5. Get an RPC URL

Create a free app at [Alchemy](https://alchemy.com) or [Infura](https://infura.io):
1. Create a new app
2. Select **Ethereum Sepolia** network
3. Copy the **HTTPS** URL

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/SakshiShah29/Workshop-template.git
cd chainbeasts/contracts

# 2. Install Foundry dependencies (OpenZeppelin, forge-std)
forge install

# 3. Set up environment
cp .env.example .env
# Edit .env with your RPC URL and private key

# 4. Build contracts
forge build

# 5. Run tests
forge test

# 6. Deploy to Ethereum Sepolia
forge script script/Deploy.s.sol --rpc-url $ETH_SEPOLIA_RPC_URL --broadcast
```

---

## Deploy Command

```bash
forge script script/Deploy.s.sol \
  --rpc-url $ETH_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

> **One command does everything:** deploys PowerToken, deploys ChainBeasts, and calls `setStageURI()` for all 3 stages. No manual cast calls needed.

After deployment, copy the contract addresses printed in the console into `frontend/src/config/contracts.ts`.

---

## Project Structure

```
chainbeasts/
├── contracts/
│   ├── src/
│   │   ├── PowerToken.sol       — ERC-20 token ($POWER), 10M initial supply
│   │   └── ChainBeasts.sol      — ERC-721 NFT with 3-stage evolution
│   ├── test/
│   │   ├── PowerToken.t.sol     — Unit tests for $POWER token
│   │   └── ChainBeasts.t.sol    — Unit tests for mint + evolve
│   ├── script/
│   │   └── Deploy.s.sol         — Deployment script (deploy + set URIs)
│   ├── foundry.toml             — Foundry config
│   ├── remappings.txt           — Import path aliases
│   └── .env.example             — Environment variable template
├── metadata/
│   ├── images/                  — Beast images (upload to IPFS)
│   └── json/                    — NFT metadata JSON files (stages 1–3)
├── frontend/                    — Next.js frontend (set up later)
├── .gitignore
└── README.md
```

---

## Contracts Overview

### PowerToken.sol

ERC-20 token with burn extension.

| Function | Description |
|----------|-------------|
| `constructor(address initialOwner)` | Mints 10,000,000 $POWER to `initialOwner` |
| `transfer(to, amount)` | Standard ERC-20 transfer |
| `approve(spender, amount)` | Approve ChainBeasts contract to spend/burn |
| `burnFrom(account, amount)` | Burns tokens from an approved account (used by evolve) |

### ChainBeasts.sol

ERC-721 NFT contract.

| Function | Description |
|----------|-------------|
| `mintBeast()` | Spend 100 $POWER → mint Stage 1 beast |
| `evolve(tokenId)` | Burn 250/500 $POWER → evolve to Stage 2/3 |
| `setStageURI(stage, uri)` | Owner only — set IPFS URI for a stage |
| `withdrawPower()` | Owner only — withdraw accumulated $POWER |
| `getOwnedTokens(address)` | View all tokenIds owned by an address |
| `getEvolveCost(stage)` | View cost to evolve from a given stage |

---

## Useful Foundry Commands

```bash
# Build
forge build

# Test
forge test
forge test -vv          # verbose: show logs
forge test -vvv         # very verbose: show traces
forge test --match-test testMintBeast   # run specific test

# Read from chain
cast call <CONTRACT_ADDR> "balanceOf(address)(uint256)" <WALLET_ADDR> \
  --rpc-url $ETH_SEPOLIA_RPC_URL

cast call <CONTRACT_ADDR> "beastStage(uint256)(uint8)" 0 \
  --rpc-url $ETH_SEPOLIA_RPC_URL

# Write to chain
cast send <CONTRACT_ADDR> "approve(address,uint256)" <BEASTS_ADDR> $(cast to-wei 100) \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $ETH_SEPOLIA_RPC_URL

cast send <CONTRACT_ADDR> "mintBeast()" \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $ETH_SEPOLIA_RPC_URL

# Unit conversions
cast to-wei 100          # 100 ETH/tokens → wei (100000000000000000000)
cast from-wei 1000000000000000000   # wei → ETH

# Check balance
cast balance <WALLET_ADDR> --rpc-url $ETH_SEPOLIA_RPC_URL
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `foundryup: command not found` | Run `source ~/.zshrc` (or `~/.bashrc`), then retry |
| `forge: command not found` | Same as above — shell needs to reload PATH |
| `wsl --install` fails (Windows) | Your Windows may already have WSL — open Ubuntu from Start menu directly |
| `curl` not found in WSL | Run `sudo apt update && sudo apt install curl -y` first |
| `Error: No such file or directory: lib/openzeppelin-contracts` | Run `forge install` inside `contracts/` |
| `ERC20InsufficientAllowance` | Call `approve(chainBeastsAddress, amount)` on PowerToken first |
| `ERC20InsufficientBalance` | Your wallet doesn't have enough $POWER — check balance |
| `OwnableUnauthorizedAccount` | You're calling an `onlyOwner` function from the wrong wallet |
| `Insufficient funds for gas` | Get Sepolia ETH from the faucets above |
| Transaction lands on wrong chain | Confirm MetaMask is on Sepolia (Chain ID 11155111) |
| `forge script` hangs | Check your `ETH_SEPOLIA_RPC_URL` in `.env` is valid |

---

## Resources

- [Foundry Book](https://book.getfoundry.sh)
- [OpenZeppelin Contracts Docs](https://docs.openzeppelin.com/contracts/5.x/)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com)
- [Sepolia Explorer](https://sepolia.etherscan.io)
- [Pinata (IPFS)](https://pinata.cloud)
- [wagmi v2 Docs](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com/docs/introduction)

---

## License

MIT
