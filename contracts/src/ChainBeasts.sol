// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title ChainBeasts - Anime NFT Evolution Game
/// @notice Mint beast NFTs by spending $POWER, evolve them by burning $POWER
/// @dev One character with 3 evolution stages. Uses OpenZeppelin v5.
contract ChainBeasts is ERC721, ERC721URIStorage, Ownable {

    // ── Errors ──────────────────────────────────────────────
    error AlreadyMaxStage(uint256 tokenId);
    error NotBeastOwner(uint256 tokenId);
    error StageURINotSet(uint8 stage);

    // ── Events ──────────────────────────────────────────────
    event BeastMinted(address indexed owner, uint256 indexed tokenId);
    event BeastEvolved(uint256 indexed tokenId, uint8 newStage);

    // ── Constants ───────────────────────────────────────────
    uint256 public constant MINT_COST = 100 * 10 ** 18;
    uint256 public constant EVOLVE_STAGE2_COST = 250 * 10 ** 18;
    uint256 public constant EVOLVE_STAGE3_COST = 500 * 10 ** 18;
    uint8 public constant MAX_STAGE = 3;


    // ── State ───────────────────────────────────────────────

    ERC20Burnable public immutable powerToken;
    uint256 private _nextTokenId;

    /// @dev tokenId => evolution stage (1, 2, or 3)
    mapping(uint256 => uint8) public beastStage;

    /// @dev stage number (1, 2, 3) => IPFS metadata URI
    mapping(uint8 => string) public stageURIs;

    /// @dev owner => array of their tokenIds (simple frontend lookup)
    mapping(address => uint256[]) private _ownedTokens;

    // ── Constructor ─────────────────────────────────────────

    // TODO : Complete the constructor
    constructor(
        address _powerToken,
        address initialOwner
    ) ERC721() Ownable(initialOwner) {

    }

    // ── Admin Functions ─────────────────────────────────────

    /// @notice Set the IPFS metadata URI for a specific stage
    /// @dev Must be called 3 times (stages 1, 2, 3) after uploading to IPFS
    function setStageURI(uint8 stage, string calldata uri) external onlyOwner {
        require(stage >= 1 && stage <= 3, "Invalid stage");
       // TODO : Complete the function
    }

      function withdrawPower() external onlyOwner {
        uint256 balance = powerToken.balanceOf(address(this));
        require(balance > 0, "No POWER to withdraw");
        powerToken.transfer(owner(), balance);
    }

    // ── Core Functions ──────────────────────────────────────

    /// @notice Mint a new beast at Stage 1
    /// @dev Caller must have approved at least MINT_COST of $POWER
    // TODO : Complete the mintBeast function
    // Steps:
    //   1. Check that stageURIs[1] is set (revert StageURINotSet if empty)
    //   2. Collect payment: call powerToken.transferFrom(msg.sender, address(this), MINT_COST)
    //      → This is the PAYMENT pattern — tokens move from user to contract
    //   3. Mint the NFT: _safeMint(msg.sender, tokenId) using _nextTokenId++
    //   4. Set the metadata: _setTokenURI(tokenId, stageURIs[1])
    //   5. Track state: set beastStage[tokenId] = 1
    //   6. Track ownership: push tokenId to _ownedTokens[msg.sender]
    //   7. Emit BeastMinted event
    //   8. Return the tokenId
    function mintBeast() external returns (uint256) {

    }

    /// @notice Evolve a beast to its next stage by burning $POWER
    /// @dev Caller must own the beast AND have approved $POWER for burnFrom
    // TODO : Complete the evolve function
    // Steps:
    //   1. Check ownership: ownerOf(tokenId) must equal msg.sender
    //      → If not, revert NotBeastOwner
    //   2. Check stage: beastStage[tokenId] must be < MAX_STAGE
    //      → If not, revert AlreadyMaxStage
    //   3. Calculate newStage = currentStage + 1
    //   4. Check that stageURIs[newStage] is set
    //   5. Calculate cost using getEvolveCost(currentStage)
    //   6. BURN tokens: call powerToken.burnFrom(msg.sender, cost)
    //      → This is the DESTRUCTION pattern — tokens cease to exist!
    //      → Different from mint which uses transferFrom (payment)
    //   7. Update beastStage[tokenId] = newStage
    //   8. Update tokenURI: _setTokenURI(tokenId, stageURIs[newStage])
    //   9. Emit BeastEvolved event
    function evolve(uint256 tokenId) external {

    }

    // ── View Functions ──────────────────────────────────────

    /// @notice Get the $POWER cost to evolve from a given stage
    function getEvolveCost(uint8 currentStage) public pure returns (uint256) {
        if (currentStage == 1) return EVOLVE_STAGE2_COST;
        if (currentStage == 2) return EVOLVE_STAGE3_COST;
        revert("Already max stage");
    }

    /// @notice Get all tokenIds owned by an address
    /// @dev Simple approach for workshop — does not update on transfers
    function getOwnedTokens(address owner_) external view returns (uint256[] memory) {
        return _ownedTokens[owner_];
    }

    // ── Required Overrides ──────────────────────────────────
    // Solidity requires explicit overrides when two parent contracts
    // define the same function (ERC721 and ERC721URIStorage both have tokenURI)

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

