// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {StrategyFactory} from "../src/StrategyFactory.sol";
import {Registry} from "../src/Registry.sol";
import {Strategy} from "../src/Strategy.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)); // Anvil default

        vm.startBroadcast(deployerPrivateKey);

        // Deploy StrategyFactory
        StrategyFactory factory = new StrategyFactory();
        console.log("StrategyFactory deployed at:", address(factory));

        // Deploy Registry
        Registry registry = new Registry();
        console.log("Registry deployed at:", address(registry));

        // Create a sample strategy for testing
        Strategy.Destination[] memory destinations = new Strategy.Destination[](3);
        destinations[0] = Strategy.Destination({
            recipient: address(0x1234567890123456789012345678901234567890),
            weightBps: 4000,
            label: "Protocol Guild"
        });
        destinations[1] = Strategy.Destination({
            recipient: address(0x2345678901234567890123456789012345678901),
            weightBps: 3500,
            label: "Gitcoin Grants"
        });
        destinations[2] = Strategy.Destination({
            recipient: address(0x3456789012345678901234567890123456789012),
            weightBps: 2500,
            label: "Optimism RetroPGF"
        });

        address strategy1 = factory.createStrategy(
            "Ethereum Core Dev Fund",
            "ipfs://QmExample1",
            200, // 2% fee
            destinations
        );
        console.log("Sample Strategy 1 deployed at:", strategy1);

        // Create another sample strategy
        Strategy.Destination[] memory destinations2 = new Strategy.Destination[](2);
        destinations2[0] = Strategy.Destination({
            recipient: address(0x4567890123456789012345678901234567890123),
            weightBps: 6000,
            label: "Climate Solutions"
        });
        destinations2[1] = Strategy.Destination({
            recipient: address(0x5678901234567890123456789012345678901234),
            weightBps: 4000,
            label: "Renewable Energy Research"
        });

        address strategy2 = factory.createStrategy(
            "Climate Solutions Portfolio",
            "ipfs://QmExample2",
            100, // 1% fee
            destinations2
        );
        console.log("Sample Strategy 2 deployed at:", strategy2);

        vm.stopBroadcast();

        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("StrategyFactory:", address(factory));
        console.log("Registry:", address(registry));
        console.log("Sample strategies created: 2");
    }
}
