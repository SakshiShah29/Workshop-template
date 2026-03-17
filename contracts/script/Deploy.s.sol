// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PowerToken} from "../src/PowerToken.sol";
import {ChainBeasts} from "../src/ChainBeasts.sol";

contract DeployScript is Script {
    // ══════════════════════════════════════════════════
    // IPFS METADATA CIDs — UPDATE THESE WITH YOUR CIDs
    // ══════════════════════════════════════════════════
    string constant STAGE1_URI = "https://apricot-immense-carp-804.mypinata.cloud/ipfs/bafkreigtotufcb7z7aoplqa74wqsqdmmu64ffld7fiuk5r2xxndvuzvj5y";
    string constant STAGE2_URI = "https://apricot-immense-carp-804.mypinata.cloud/ipfs/bafkreiculyjejxshez3ia3ae4uzv6ciplrfcd5qs7nja5ebsyzgsg5c3lq";
    string constant STAGE3_URI = "https://apricot-immense-carp-804.mypinata.cloud/ipfs/bafkreibubxh4mwvfpnbhytryibd4q24xenfisgq4oivptkm3eekdot7xpu";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying from:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy PowerToken — deployer gets 10M $POWER
        PowerToken power = new PowerToken(deployer);
        console.log("PowerToken deployed at:", address(power));

        // 2. Deploy ChainBeasts — linked to PowerToken
        ChainBeasts beasts = new ChainBeasts(address(power), deployer);
        console.log("ChainBeasts deployed at:", address(beasts));

        // 3. Set stage URIs — links each stage to IPFS metadata
        beasts.setStageURI(1, STAGE1_URI);
        beasts.setStageURI(2, STAGE2_URI);
        beasts.setStageURI(3, STAGE3_URI);
        console.log("Stage URIs set for all 3 stages");

        vm.stopBroadcast();

        // Summary
        console.log("");
        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("PowerToken:", address(power));
        console.log("ChainBeasts:", address(beasts));
        console.log("");
        console.log("Stage 1 URI:", STAGE1_URI);
        console.log("Stage 2 URI:", STAGE2_URI);
        console.log("Stage 3 URI:", STAGE3_URI);
        console.log("");
        console.log("=== NEXT STEPS ===");
        console.log("1. Update frontend/src/config/contracts.ts with these addresses");
        console.log("2. Run: cd frontend && npm run dev");
    }
}
