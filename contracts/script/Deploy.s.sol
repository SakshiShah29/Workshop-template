// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PowerToken} from "../src/PowerToken.sol";
import {ChainBeasts} from "../src/ChainBeasts.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying from:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy PowerToken — deployer gets 10M $POWER
        PowerToken power = new PowerToken(deployer);
        console.log("PowerToken deployed at:", address(power));

        // Deploy ChainBeasts — linked to PowerToken
        ChainBeasts beasts = new ChainBeasts(address(power), deployer);
        console.log("ChainBeasts deployed at:", address(beasts));

        vm.stopBroadcast();

        console.log("");
        console.log("=== NEXT STEPS ===");
        console.log("1. Upload images + metadata JSON to IPFS (Pinata)");
        console.log("2. Set stage URIs:");
        console.log("   cast send", address(beasts), '"setStageURI(uint8,string)" 1 "ipfs://YOUR_CID/stage1.json"');
        console.log("   (repeat for stages 2 and 3)");
        console.log("3. Update frontend/src/config/contracts.ts with these addresses");
    }
}