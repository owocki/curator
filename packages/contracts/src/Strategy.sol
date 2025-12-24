// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {ReentrancyGuard} from "./lib/ReentrancyGuard.sol";

/// @title Strategy
/// @notice A non-custodial capital allocation strategy that distributes funds to multiple destinations
/// @dev Funds flow through immediately - never held by the contract
contract Strategy is ReentrancyGuard {
    struct Destination {
        address recipient;
        uint256 weightBps; // Basis points (100 = 1%, 10000 = 100%)
        string label;
    }

    string public name;
    string public metadataURI;
    address public curator;
    uint256 public curatorFeeBps;
    Destination[] public destinations;

    uint256 public totalAllocated;
    uint256 public totalDonors;
    mapping(address => bool) public hasDonated;

    uint256 public constant MAX_BPS = 10000;
    uint256 public constant MAX_CURATOR_FEE_BPS = 1000; // 10% max fee

    event Funded(
        address indexed donor,
        uint256 amount,
        address token,
        uint256 curatorFee
    );
    event DestinationFunded(
        address indexed recipient,
        uint256 amount,
        address token
    );

    error InvalidWeights();
    error InvalidCuratorFee();
    error TransferFailed();
    error NoDestinations();

    constructor(
        string memory _name,
        string memory _metadataURI,
        address _curator,
        uint256 _curatorFeeBps,
        Destination[] memory _destinations
    ) {
        if (_destinations.length == 0) revert NoDestinations();
        if (_curatorFeeBps > MAX_CURATOR_FEE_BPS) revert InvalidCuratorFee();

        uint256 totalWeight;
        for (uint256 i = 0; i < _destinations.length; i++) {
            totalWeight += _destinations[i].weightBps;
            destinations.push(_destinations[i]);
        }
        if (totalWeight != MAX_BPS) revert InvalidWeights();

        name = _name;
        metadataURI = _metadataURI;
        curator = _curator;
        curatorFeeBps = _curatorFeeBps;
    }

    /// @notice Fund the strategy with ETH
    /// @dev Funds are immediately distributed to destinations
    function fund() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");

        uint256 curatorFee = (msg.value * curatorFeeBps) / MAX_BPS;
        uint256 distributableAmount = msg.value - curatorFee;

        // Track donor
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            totalDonors++;
        }
        totalAllocated += msg.value;

        // Send curator fee
        if (curatorFee > 0) {
            (bool feeSuccess, ) = curator.call{value: curatorFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Distribute to destinations
        for (uint256 i = 0; i < destinations.length; i++) {
            uint256 amount = (distributableAmount * destinations[i].weightBps) / MAX_BPS;
            if (amount > 0) {
                (bool success, ) = destinations[i].recipient.call{value: amount}("");
                if (!success) revert TransferFailed();
                emit DestinationFunded(destinations[i].recipient, amount, address(0));
            }
        }

        emit Funded(msg.sender, msg.value, address(0), curatorFee);
    }

    /// @notice Fund the strategy with ERC20 tokens
    /// @param token The ERC20 token address
    /// @param amount The amount to distribute
    function fundERC20(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Must send tokens");

        IERC20 tokenContract = IERC20(token);

        // Transfer tokens from sender to this contract temporarily
        bool transferSuccess = tokenContract.transferFrom(msg.sender, address(this), amount);
        if (!transferSuccess) revert TransferFailed();

        uint256 curatorFee = (amount * curatorFeeBps) / MAX_BPS;
        uint256 distributableAmount = amount - curatorFee;

        // Track donor
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            totalDonors++;
        }
        totalAllocated += amount;

        // Send curator fee
        if (curatorFee > 0) {
            bool feeSuccess = tokenContract.transfer(curator, curatorFee);
            if (!feeSuccess) revert TransferFailed();
        }

        // Distribute to destinations
        for (uint256 i = 0; i < destinations.length; i++) {
            uint256 destAmount = (distributableAmount * destinations[i].weightBps) / MAX_BPS;
            if (destAmount > 0) {
                bool success = tokenContract.transfer(destinations[i].recipient, destAmount);
                if (!success) revert TransferFailed();
                emit DestinationFunded(destinations[i].recipient, destAmount, token);
            }
        }

        emit Funded(msg.sender, amount, token, curatorFee);
    }

    /// @notice Get all destinations
    function getDestinations() external view returns (Destination[] memory) {
        return destinations;
    }

    /// @notice Get the number of destinations
    function getDestinationCount() external view returns (uint256) {
        return destinations.length;
    }

    /// @notice Get strategy info
    function getInfo() external view returns (
        string memory _name,
        string memory _metadataURI,
        address _curator,
        uint256 _curatorFeeBps,
        uint256 _totalAllocated,
        uint256 _totalDonors
    ) {
        return (name, metadataURI, curator, curatorFeeBps, totalAllocated, totalDonors);
    }
}
