// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Strategy} from "./Strategy.sol";

/// @title StrategyFactory
/// @notice Factory contract for creating and tracking Strategy instances
contract StrategyFactory {
    address[] public strategies;
    mapping(address => address[]) public curatorStrategies;
    mapping(address => bool) public isStrategy;

    event StrategyCreated(
        address indexed strategy,
        address indexed curator,
        string name,
        uint256 curatorFeeBps
    );

    /// @notice Create a new strategy
    /// @param _name Strategy name
    /// @param _metadataURI IPFS URI for metadata
    /// @param _curatorFeeBps Curator fee in basis points
    /// @param _destinations Array of funding destinations
    /// @return strategy Address of the created strategy
    function createStrategy(
        string calldata _name,
        string calldata _metadataURI,
        uint256 _curatorFeeBps,
        Strategy.Destination[] calldata _destinations
    ) external returns (address strategy) {
        Strategy newStrategy = new Strategy(
            _name,
            _metadataURI,
            msg.sender,
            _curatorFeeBps,
            _destinations
        );

        strategy = address(newStrategy);
        strategies.push(strategy);
        curatorStrategies[msg.sender].push(strategy);
        isStrategy[strategy] = true;

        emit StrategyCreated(strategy, msg.sender, _name, _curatorFeeBps);
    }

    /// @notice Get all strategies
    function getStrategies() external view returns (address[] memory) {
        return strategies;
    }

    /// @notice Get total strategy count
    function getStrategyCount() external view returns (uint256) {
        return strategies.length;
    }

    /// @notice Get strategies by curator
    function getStrategiesByCurator(address curator) external view returns (address[] memory) {
        return curatorStrategies[curator];
    }

    /// @notice Get paginated strategies
    /// @param offset Starting index
    /// @param limit Maximum number to return
    function getStrategiesPaginated(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory result)
    {
        uint256 total = strategies.length;
        if (offset >= total) {
            return new address[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = strategies[i];
        }
    }
}
