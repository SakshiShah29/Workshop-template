// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


/// @title PowerToken — $POWER ERC-20 for the ChainBeasts ecosystem
/// @notice Fungible token used to mint and evolve ChainBeasts NFTs
contract PowerToken is ERC20 {
    // TODO 1: Add ERC20Burnable and Ownable to the inheritance

    /// @notice Total supply: 10 million POWER (with 18 decimals)
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 10 ** 18;

    /// @param initialOwner The address that receives all tokens + admin rights
    constructor(address initialOwner) ERC20() {
        // TODO 2: Add Ownable(initialOwner) and ERC20 to the constructor
    

        // TODO 3: Mint the initial supply to the deployer

    }

    /// @notice Airdrop tokens from owner's balance to multiple recipients
    /// @dev Uses _transfer (not _mint) — distributes from existing supply
    /// @param recipients Array of wallet addresses to receive tokens
    /// @param amount Amount each recipient gets (in wei, e.g. 5000 * 10**18)
    function airdrop(address[] calldata recipients, uint256 amount) external {
        // TODO 4: Add the modifer logic and the airdrop related logic

    }
}