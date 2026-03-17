// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PowerToken} from "../src/PowerToken.sol";
import {ChainBeasts} from "../src/ChainBeasts.sol";

contract ChainBeastsTest is Test {
    PowerToken public power;
    ChainBeasts public beasts;

    address public owner = makeAddr("owner");
    address public player = makeAddr("player");

    function setUp() public {
        vm.startPrank(owner);

        power = new PowerToken(owner);
        beasts = new ChainBeasts(address(power), owner);

        // Set stage URIs
        beasts.setStageURI(1, "ipfs://test/stage1.json");
        beasts.setStageURI(2, "ipfs://test/stage2.json");
        beasts.setStageURI(3, "ipfs://test/stage3.json");

        // Give player 5000 POWER
        power.transfer(player, 5000 * 10 ** 18);

        vm.stopPrank();
    }

    // ── Helper ──────────────────────────────────────

    function _mintAsPlayer() internal returns (uint256) {
        vm.startPrank(player);
        power.approve(address(beasts), beasts.MINT_COST());
        uint256 tokenId = beasts.mintBeast();
        vm.stopPrank();
        return tokenId;
    }

    // ── Deployment ──────────────────────────────────

    function test_Deployment() public view {
        assertEq(beasts.name(), "ChainBeasts");
        assertEq(beasts.symbol(), "BEAST");
        assertEq(address(beasts.powerToken()), address(power));
    }

    // ── Minting ─────────────────────────────────────

    function test_MintBeast() public {
        uint256 tokenId = _mintAsPlayer();

        assertEq(beasts.ownerOf(tokenId), player);
        assertEq(beasts.beastStage(tokenId), 1);
        assertEq(beasts.tokenURI(tokenId), "ipfs://test/stage1.json");
    }

    function test_MintCostDeducted() public {
        uint256 before = power.balanceOf(player);
        _mintAsPlayer();
        assertEq(power.balanceOf(player), before - 100 * 10 ** 18);
    }

    function test_MintPaymentGoesToContract() public {
        _mintAsPlayer();
        assertEq(power.balanceOf(address(beasts)), 100 * 10 ** 18);
    }

    function test_MintMultiple() public {
        uint256 id1 = _mintAsPlayer();
        uint256 id2 = _mintAsPlayer();
        assertEq(id1, 0);
        assertEq(id2, 1);
    }

    function test_OwnedTokensTracked() public {
        _mintAsPlayer();
        _mintAsPlayer();

        uint256[] memory tokens = beasts.getOwnedTokens(player);
        assertEq(tokens.length, 2);
        assertEq(tokens[0], 0);
        assertEq(tokens[1], 1);
    }

    function test_RevertMintWithoutApproval() public {
        vm.prank(player);
        vm.expectRevert();
        beasts.mintBeast();
    }

    // ── Evolution ───────────────────────────────────

    function test_EvolveToStage2() public {
        uint256 tokenId = _mintAsPlayer();

        vm.startPrank(player);
        power.approve(address(beasts), beasts.EVOLVE_STAGE2_COST());
        beasts.evolve(tokenId);
        vm.stopPrank();

        assertEq(beasts.beastStage(tokenId), 2);
        assertEq(beasts.tokenURI(tokenId), "ipfs://test/stage2.json");
    }

    function test_EvolveToStage3() public {
        uint256 tokenId = _mintAsPlayer();

        vm.startPrank(player);
        // Stage 1 -> 2
        power.approve(address(beasts), beasts.EVOLVE_STAGE2_COST());
        beasts.evolve(tokenId);
        // Stage 2 -> 3
        power.approve(address(beasts), beasts.EVOLVE_STAGE3_COST());
        beasts.evolve(tokenId);
        vm.stopPrank();

        assertEq(beasts.beastStage(tokenId), 3);
        assertEq(beasts.tokenURI(tokenId), "ipfs://test/stage3.json");
    }

    function test_EvolveBurnsPower() public {
        uint256 tokenId = _mintAsPlayer();
        uint256 supplyBefore = power.totalSupply();

        vm.startPrank(player);
        power.approve(address(beasts), beasts.EVOLVE_STAGE2_COST());
        beasts.evolve(tokenId);
        vm.stopPrank();

        // Total supply decreased — tokens were burned, not just transferred
        assertEq(power.totalSupply(), supplyBefore - 250 * 10 ** 18);
    }

    function test_RevertEvolveMaxStage() public {
        uint256 tokenId = _mintAsPlayer();

        vm.startPrank(player);
        power.approve(address(beasts), beasts.EVOLVE_STAGE2_COST());
        beasts.evolve(tokenId);
        power.approve(address(beasts), beasts.EVOLVE_STAGE3_COST());
        beasts.evolve(tokenId);

        // Already at Stage 3 — should revert
        power.approve(address(beasts), 1000 * 10 ** 18);
        vm.expectRevert(abi.encodeWithSelector(ChainBeasts.AlreadyMaxStage.selector, tokenId));
        beasts.evolve(tokenId);
        vm.stopPrank();
    }

    function test_RevertEvolveNotOwner() public {
        uint256 tokenId = _mintAsPlayer();

        address stranger = makeAddr("stranger");
        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(ChainBeasts.NotBeastOwner.selector, tokenId));
        beasts.evolve(tokenId);
    }

    // ── View Functions ──────────────────────────────

    function test_GetEvolveCostStage1() public view {
        assertEq(beasts.getEvolveCost(1), 250 * 10 ** 18);
    }

    function test_GetEvolveCostStage2() public view {
        assertEq(beasts.getEvolveCost(2), 500 * 10 ** 18);
    }

    // ── Admin ───────────────────────────────────────

    function test_WithdrawPower() public {
        _mintAsPlayer();

        uint256 ownerBefore = power.balanceOf(owner);
        vm.prank(owner);
        beasts.withdrawPower();

        assertEq(power.balanceOf(owner), ownerBefore + 100 * 10 ** 18);
    }

    function test_SetStageURIOnlyOwner() public {
        vm.prank(player);
        vm.expectRevert();
        beasts.setStageURI(1, "ipfs://hacked");
    }
}