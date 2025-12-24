// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Registry
/// @notice Registry of verified funding mechanisms and destinations
contract Registry {
    struct MechanismEntry {
        address mechanism;
        string name;
        string category;
        string metadataURI;
        bool verified;
        uint256 addedAt;
    }

    address public owner;
    address public pendingOwner;

    MechanismEntry[] public mechanisms;
    mapping(address => uint256) public mechanismIndex;
    mapping(address => bool) public isMechanism;

    string[] public categories;
    mapping(string => bool) public categoryExists;

    event MechanismAdded(address indexed mechanism, string name, string category);
    event MechanismVerified(address indexed mechanism);
    event MechanismUnverified(address indexed mechanism);
    event CategoryAdded(string category);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error Unauthorized();
    error AlreadyExists();
    error NotFound();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
        // Add default categories
        _addCategory("grants");
        _addCategory("retropgf");
        _addCategory("bounties");
        _addCategory("direct");
        _addCategory("streaming");
    }

    /// @notice Add a new mechanism to the registry
    function addMechanism(
        address _mechanism,
        string calldata _name,
        string calldata _category,
        string calldata _metadataURI
    ) external onlyOwner {
        if (_mechanism == address(0)) revert InvalidAddress();
        if (isMechanism[_mechanism]) revert AlreadyExists();

        if (!categoryExists[_category]) {
            _addCategory(_category);
        }

        mechanisms.push(MechanismEntry({
            mechanism: _mechanism,
            name: _name,
            category: _category,
            metadataURI: _metadataURI,
            verified: false,
            addedAt: block.timestamp
        }));

        mechanismIndex[_mechanism] = mechanisms.length - 1;
        isMechanism[_mechanism] = true;

        emit MechanismAdded(_mechanism, _name, _category);
    }

    /// @notice Verify a mechanism
    function verifyMechanism(address _mechanism) external onlyOwner {
        if (!isMechanism[_mechanism]) revert NotFound();
        mechanisms[mechanismIndex[_mechanism]].verified = true;
        emit MechanismVerified(_mechanism);
    }

    /// @notice Unverify a mechanism
    function unverifyMechanism(address _mechanism) external onlyOwner {
        if (!isMechanism[_mechanism]) revert NotFound();
        mechanisms[mechanismIndex[_mechanism]].verified = false;
        emit MechanismUnverified(_mechanism);
    }

    /// @notice Get all mechanisms
    function getMechanisms() external view returns (MechanismEntry[] memory) {
        return mechanisms;
    }

    /// @notice Get verified mechanisms only
    function getVerifiedMechanisms() external view returns (MechanismEntry[] memory) {
        uint256 count;
        for (uint256 i = 0; i < mechanisms.length; i++) {
            if (mechanisms[i].verified) count++;
        }

        MechanismEntry[] memory verified = new MechanismEntry[](count);
        uint256 j;
        for (uint256 i = 0; i < mechanisms.length; i++) {
            if (mechanisms[i].verified) {
                verified[j++] = mechanisms[i];
            }
        }
        return verified;
    }

    /// @notice Get mechanisms by category
    function getMechanismsByCategory(string calldata _category)
        external
        view
        returns (MechanismEntry[] memory)
    {
        uint256 count;
        for (uint256 i = 0; i < mechanisms.length; i++) {
            if (keccak256(bytes(mechanisms[i].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }

        MechanismEntry[] memory result = new MechanismEntry[](count);
        uint256 j;
        for (uint256 i = 0; i < mechanisms.length; i++) {
            if (keccak256(bytes(mechanisms[i].category)) == keccak256(bytes(_category))) {
                result[j++] = mechanisms[i];
            }
        }
        return result;
    }

    /// @notice Get all categories
    function getCategories() external view returns (string[] memory) {
        return categories;
    }

    /// @notice Add a new category
    function addCategory(string calldata _category) external onlyOwner {
        _addCategory(_category);
    }

    function _addCategory(string memory _category) internal {
        if (!categoryExists[_category]) {
            categories.push(_category);
            categoryExists[_category] = true;
            emit CategoryAdded(_category);
        }
    }

    /// @notice Start ownership transfer
    function transferOwnership(address newOwner) external onlyOwner {
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    /// @notice Accept ownership transfer
    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert Unauthorized();
        emit OwnershipTransferred(owner, pendingOwner);
        owner = pendingOwner;
        pendingOwner = address(0);
    }
}
