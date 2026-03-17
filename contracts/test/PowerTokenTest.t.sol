// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PowerToken} from "../src/PowerToken.sol";

contract PowerTokenTest is Test {
    PowerToken public token;
    address public owner = makeAddr("owner");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        vm.prank(owner);
        token = new PowerToken(owner);
    }

    function test_NameAndSymbol() public view {
        assertEq(token.name(), "Power Token");
        assertEq(token.symbol(), "POWER");
        assertEq(token.decimals(), 18);
    }

    function test_InitialSupplyToOwner() public view {
        assertEq(token.totalSupply(), 10_000_000 * 10 ** 18);
        assertEq(token.balanceOf(owner), 10_000_000 * 10 ** 18);
    }

    function test_Transfer() public {
        vm.prank(owner);
        token.transfer(alice, 1000 * 10 ** 18);
        assertEq(token.balanceOf(alice), 1000 * 10 ** 18);
    }

    function test_ApproveAndTransferFrom() public {
        vm.prank(owner);
        token.approve(alice, 500 * 10 ** 18);

        vm.prank(alice);
        token.transferFrom(owner, bob, 500 * 10 ** 18);
        assertEq(token.balanceOf(bob), 500 * 10 ** 18);
    }

    function test_Burn() public {
        vm.prank(owner);
        token.burn(100 * 10 ** 18);
        assertEq(token.totalSupply(), 9_999_900 * 10 ** 18);
    }

    function test_BurnFrom() public {
        vm.prank(owner);
        token.approve(alice, 200 * 10 ** 18);

        vm.prank(alice);
        token.burnFrom(owner, 200 * 10 ** 18);
        assertEq(token.totalSupply(), 9_999_800 * 10 ** 18);
    }

    function test_Airdrop() public {
        address[] memory recipients = new address[](3);
        recipients[0] = alice;
        recipients[1] = bob;
        recipients[2] = makeAddr("charlie");

        vm.prank(owner);
        token.airdrop(recipients, 5000 * 10 ** 18);

        assertEq(token.balanceOf(alice), 5000 * 10 ** 18);
        assertEq(token.balanceOf(bob), 5000 * 10 ** 18);
        assertEq(token.balanceOf(recipients[2]), 5000 * 10 ** 18);
    }

    function test_AirdropOnlyOwner() public {
        address[] memory recipients = new address[](1);
        recipients[0] = alice;

        vm.prank(alice);
        vm.expectRevert();
        token.airdrop(recipients, 100 * 10 ** 18);
    }
}