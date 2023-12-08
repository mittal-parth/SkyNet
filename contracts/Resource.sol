// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Resource {
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

    // Mappings to store instances of each struct by their id
    mapping(uint256 => Data) public dataObjectsById;
    mapping(uint256 => Model) public modelObjectsById;
}
