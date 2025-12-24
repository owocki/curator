// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Strategy} from "../src/Strategy.sol";
import {StrategyFactory} from "../src/StrategyFactory.sol";

contract StrategyTest is Test {
    StrategyFactory public factory;
    Strategy public strategy;

    address public curator = address(0x1);
    address public donor = address(0x2);
    address public dest1 = address(0x3);
    address public dest2 = address(0x4);
    address public dest3 = address(0x5);

    function setUp() public {
        factory = new StrategyFactory();

        Strategy.Destination[] memory destinations = new Strategy.Destination[](3);
        destinations[0] = Strategy.Destination({
            recipient: dest1,
            weightBps: 4000, // 40%
            label: "Protocol Guild"
        });
        destinations[1] = Strategy.Destination({
            recipient: dest2,
            weightBps: 3500, // 35%
            label: "Gitcoin Grants"
        });
        destinations[2] = Strategy.Destination({
            recipient: dest3,
            weightBps: 2500, // 25%
            label: "Optimism RetroPGF"
        });

        vm.prank(curator);
        address strategyAddr = factory.createStrategy(
            "Ethereum Core Dev Fund",
            "ipfs://metadata",
            200, // 2% curator fee
            destinations
        );
        strategy = Strategy(strategyAddr);
    }

    function test_StrategyCreation() public view {
        assertEq(strategy.name(), "Ethereum Core Dev Fund");
        assertEq(strategy.curator(), curator);
        assertEq(strategy.curatorFeeBps(), 200);
        assertEq(strategy.getDestinationCount(), 3);
    }

    function test_FactoryTracking() public view {
        assertEq(factory.getStrategyCount(), 1);
        assertTrue(factory.isStrategy(address(strategy)));
        assertEq(factory.getStrategiesByCurator(curator).length, 1);
    }

    function test_FundETH() public {
        uint256 fundAmount = 1 ether;

        vm.deal(donor, fundAmount);
        vm.prank(donor);
        strategy.fund{value: fundAmount}();

        // Check curator received fee (2% of 1 ETH = 0.02 ETH)
        assertEq(curator.balance, 0.02 ether);

        // Check destinations received correct amounts
        // Distributable = 0.98 ETH
        // dest1: 40% of 0.98 = 0.392 ETH
        // dest2: 35% of 0.98 = 0.343 ETH
        // dest3: 25% of 0.98 = 0.245 ETH
        assertEq(dest1.balance, 0.392 ether);
        assertEq(dest2.balance, 0.343 ether);
        assertEq(dest3.balance, 0.245 ether);

        // Check tracking
        assertEq(strategy.totalAllocated(), fundAmount);
        assertEq(strategy.totalDonors(), 1);
        assertTrue(strategy.hasDonated(donor));
    }

    function test_MultipleDonors() public {
        address donor2 = address(0x6);

        vm.deal(donor, 1 ether);
        vm.deal(donor2, 2 ether);

        vm.prank(donor);
        strategy.fund{value: 1 ether}();

        vm.prank(donor2);
        strategy.fund{value: 2 ether}();

        assertEq(strategy.totalDonors(), 2);
        assertEq(strategy.totalAllocated(), 3 ether);

        // Same donor again should not increase count
        vm.deal(donor, 1 ether);
        vm.prank(donor);
        strategy.fund{value: 1 ether}();

        assertEq(strategy.totalDonors(), 2);
        assertEq(strategy.totalAllocated(), 4 ether);
    }

    function test_GetDestinations() public view {
        Strategy.Destination[] memory dests = strategy.getDestinations();
        assertEq(dests.length, 3);
        assertEq(dests[0].recipient, dest1);
        assertEq(dests[0].weightBps, 4000);
        assertEq(dests[0].label, "Protocol Guild");
    }

    function test_GetInfo() public view {
        (
            string memory _name,
            string memory _metadataURI,
            address _curator,
            uint256 _curatorFeeBps,
            uint256 _totalAllocated,
            uint256 _totalDonors
        ) = strategy.getInfo();

        assertEq(_name, "Ethereum Core Dev Fund");
        assertEq(_metadataURI, "ipfs://metadata");
        assertEq(_curator, curator);
        assertEq(_curatorFeeBps, 200);
        assertEq(_totalAllocated, 0);
        assertEq(_totalDonors, 0);
    }

    function test_RevertWhen_InvalidWeights() public {
        Strategy.Destination[] memory destinations = new Strategy.Destination[](2);
        destinations[0] = Strategy.Destination({
            recipient: dest1,
            weightBps: 5000,
            label: "Dest 1"
        });
        destinations[1] = Strategy.Destination({
            recipient: dest2,
            weightBps: 4000, // Only adds to 9000, not 10000
            label: "Dest 2"
        });

        vm.prank(curator);
        vm.expectRevert(Strategy.InvalidWeights.selector);
        factory.createStrategy("Invalid", "ipfs://", 200, destinations);
    }

    function test_RevertWhen_ExcessiveCuratorFee() public {
        Strategy.Destination[] memory destinations = new Strategy.Destination[](1);
        destinations[0] = Strategy.Destination({
            recipient: dest1,
            weightBps: 10000,
            label: "Dest 1"
        });

        vm.prank(curator);
        vm.expectRevert(Strategy.InvalidCuratorFee.selector);
        factory.createStrategy("Invalid", "ipfs://", 1500, destinations); // 15% fee, max is 10%
    }

    function test_RevertWhen_NoDestinations() public {
        Strategy.Destination[] memory destinations = new Strategy.Destination[](0);

        vm.prank(curator);
        vm.expectRevert(Strategy.NoDestinations.selector);
        factory.createStrategy("Invalid", "ipfs://", 200, destinations);
    }

    function test_ZeroCuratorFee() public {
        Strategy.Destination[] memory destinations = new Strategy.Destination[](1);
        destinations[0] = Strategy.Destination({
            recipient: dest1,
            weightBps: 10000,
            label: "Dest 1"
        });

        vm.prank(curator);
        address strategyAddr = factory.createStrategy("No Fee", "ipfs://", 0, destinations);
        Strategy noFeeStrategy = Strategy(strategyAddr);

        vm.deal(donor, 1 ether);
        vm.prank(donor);
        noFeeStrategy.fund{value: 1 ether}();

        assertEq(curator.balance, 0);
        assertEq(dest1.balance, 1 ether);
    }

    function testFuzz_Fund(uint96 amount) public {
        vm.assume(amount > 0.001 ether);
        vm.assume(amount < 1000 ether);

        vm.deal(donor, amount);
        vm.prank(donor);
        strategy.fund{value: amount}();

        assertEq(strategy.totalAllocated(), amount);
    }
}
