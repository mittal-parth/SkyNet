// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Resource {
    using Counters for Counters.Counter;
    
    enum ComputeResourceStatus {
        FREE,
        IN_USE
    }
    // Data struct
    struct Data {
        uint256 id;
        string title;
        string fileAddress;
        string descriptionAddress;
        address payable owner;
        bool isForSale;
        uint256 price;
    }

    // Model struct
    struct Model {
        uint256 id;
        string title;
        string fileAddress;
        string descriptionAddress;
        address payable owner;
        bool isActive;
        uint256 price;
    }

    // ComputeResource struct
    struct ComputeResource {
        uint256 id;
        string title;
        uint256 ram;
        uint256 gpu;
        string descriptionAddress;
        address payable owner;
        uint256 score;
        uint256 ratePerMin;
        bool isActive;
        ComputeResourceStatus status;
    }

    // Job struct
    struct Job {
        uint256 id;
        uint256[] computeResourceIds;
        address payable owner;
        uint256 minScorePerComputeResource;
        uint256 computeResourceCount;
        uint256 maxRatePerMin;
        uint256 totalCost;
        JobStatus status;
    }

    // Mappings to store instances of each struct by their id
    mapping(uint256 => Data) public dataObjectsById;
    mapping(uint256 => Model) public modelObjectsById;

    // Functions to create and retrieve objects with generated IDs
    function createData(
        string memory _title,
        string memory _fileAddress,
        string memory _descriptionAddress,
        bool _isForSale,
        uint256 _price
    ) public {
        dataIdCounter.increment();
        uint256 newId = dataIdCounter.current();

        dataObjectsById[newId] = Data(
            newId,
            _title,
            _fileAddress,
            _descriptionAddress,
            payable(msg.sender),
            _isForSale,
            _price
        );
    }

    function createModel(
        string memory _title,
        string memory _fileAddress,
        string memory _descriptionAddress,
        bool _isActive,
        uint256 _price
    ) public {
        modelIdCounter.increment();
        uint256 newId = modelIdCounter.current();

        Model memory newModel = Model(
            newId,
            _title,
            _fileAddress,
            _descriptionAddress,
            payable(msg.sender),
            _isActive,
            _price
        );
        modelObjectsById[newId] = newModel;
    }
}
