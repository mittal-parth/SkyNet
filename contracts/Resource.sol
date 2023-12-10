// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

// PUSH Comm Contract Interface
interface IPUSHCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

contract Resource {
    address public EPNS_COMM_ADDRESS =
        0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    address public CONTRACT_ADDRESS =
        0x3ACE6E6cae9208d581866B3fc961582Bb8111bb6;
    using Counters for Counters.Counter;

    enum ComputeResourceStatus {
        FREE,
        IN_USE
    }

    enum JobStatus {
        INITIALISED,
        RUNNING,
        COMPLETED
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
        bool isForSale;
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
        uint256[] dataHashes;
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
    mapping(uint256 => ComputeResource) public computeResourceObjectsById;
    mapping(uint256 => Job) public jobObjectsById;

    // Counters for generating unique IDs
    Counters.Counter private dataIdCounter;
    Counters.Counter private modelIdCounter;
    Counters.Counter private computeResourceIdCounter;
    Counters.Counter private jobIdCounter;

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
        bool _isForSale,
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
            _isForSale,
            _price
        );
        modelObjectsById[newId] = newModel;
    }

    function createComputeResource(
        string memory _title,
        uint256 _ram,
        uint256 _gpu,
        string memory _descriptionAddress,
        uint256 _ratePerMin,
        bool _isActive
    ) public {
        computeResourceIdCounter.increment();
        uint256 newId = computeResourceIdCounter.current();

        uint256 calculatedScore = calculateComputeResourceScore(_ram, _gpu);

        computeResourceObjectsById[newId] = ComputeResource(
            newId,
            _title,
            _ram,
            _gpu,
            _descriptionAddress,
            payable(msg.sender),
            calculatedScore,
            _ratePerMin,
            _isActive,
            ComputeResourceStatus.FREE
        );
    }

    function createJob(
        uint256 _minScorePerComputeResource,
        uint256 _computeResourceCount,
        uint256 _maxRatePerMin,
        uint256[] memory _dataHashes
    ) public {
        jobIdCounter.increment();
        uint256 newId = jobIdCounter.current();

        uint256[] memory emptyArray; // Empty array of compute resource IDs
        jobObjectsById[newId] = Job(
            newId,
            emptyArray,
            _dataHashes,
            payable(msg.sender),
            _minScorePerComputeResource,
            _computeResourceCount,
            _maxRatePerMin,
            0,
            JobStatus.INITIALISED
        );

        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            CONTRACT_ADDRESS, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            CONTRACT_ADDRESS, // to recipient, put YOUR_CHANNEL_ADDRESS in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
                    abi.encodePacked(
                        "0", // this represents minimal identity, learn more: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
                        "+", // segregator
                        "1", // define notification type:  https://push.org/docs/notifications/build/types-of-notification (1, 3 or 4) = (Broadcast, targeted or subset)
                        "+", // segregator
                        "New Job for training has been posted!", // this is notification title
                        "+", // segregator
                        "" // notification body
                    )
                )
            )
        );
    }

    // Function to add compute resource ID to a Job
    function addComputeResourceIdToJob(
        uint256 _jobId,
        uint256 _computeResourceId
    ) public {
        Job storage job = jobObjectsById[_jobId];
        // require(job.owner == msg.sender, "Not the owner of the job");
        require(
            job.computeResourceIds.length < 50,
            "Exceeded maximum array length"
        );
        job.computeResourceIds.push(_computeResourceId);
    }

    // Function to start a Job
    function startJob(uint256 _jobId) public {
        Job storage job = jobObjectsById[_jobId];
        job.status = JobStatus.RUNNING;

        // Change the status of compute resources to IN_USE
        setComputeResourcesInUse(job.computeResourceIds);
    }

    // Function to set ComputeResource status to IN_USE
    function setComputeResourcesInUse(
        uint256[] memory _computeResourceIds
    ) internal {
        for (uint256 i = 0; i < _computeResourceIds.length; i++) {
            uint256 computeResourceId = _computeResourceIds[i];
            ComputeResource
                storage computeResource = computeResourceObjectsById[
                    computeResourceId
                ];

            require(
                computeResource.status == ComputeResourceStatus.FREE,
                "ComputeResource is not free"
            );

            computeResource.status = ComputeResourceStatus.IN_USE;
        }
    }

    // Function to mark ComputeResource as free
    function setComputeResourceFree(
        uint256 _computeResourceId,
        uint256 _jobId
    ) public {
        ComputeResource storage computeResource = computeResourceObjectsById[
            _computeResourceId
        ];
        Job storage job = jobObjectsById[_jobId];

        require(
            computeResource.status == ComputeResourceStatus.IN_USE,
            "Compute Resource must be IN_USE to mark as FREE"
        );
        require(job.status == JobStatus.RUNNING, "Job must be RUNNING");
        require(
            isComputeResourceInJob(_computeResourceId, _jobId),
            "Compute Resource not associated with the Job"
        );

        // Set the resource status as free
        computeResource.status = ComputeResourceStatus.FREE;

        // Check if all compute resources in the job are marked as free
        if (areAllComputeResourcesFree(job.computeResourceIds)) {
            // If yes, mark the job as completed
            setJobCompleted(_jobId);
        }
    }

    // Function to check if a compute resource is associated with a job
    function isComputeResourceInJob(
        uint256 _computeResourceId,
        uint256 _jobId
    ) internal view returns (bool) {
        Job storage job = jobObjectsById[_jobId];
        for (uint256 i = 0; i < job.computeResourceIds.length; i++) {
            if (job.computeResourceIds[i] == _computeResourceId) {
                return true;
            }
        }
        return false;
    }

    // Function to check if all compute resources in a job are marked as free
    function areAllComputeResourcesFree(
        uint256[] memory _computeResourceIds
    ) internal view returns (bool) {
        for (uint256 i = 0; i < _computeResourceIds.length; i++) {
            ComputeResource
                storage computeResource = computeResourceObjectsById[
                    _computeResourceIds[i]
                ];
            if (computeResource.status != ComputeResourceStatus.FREE) {
                return false;
            }
        }
        return true;
    }

    // Function to mark Job as Completed
    function setJobCompleted(uint256 _jobId) internal {
        Job storage job = jobObjectsById[_jobId];
        require(job.status == JobStatus.RUNNING, "Job must be RUNNING");
        job.status = JobStatus.COMPLETED;

        // TODO: Trasnfer the money based on score
    }

    // Buy/Sell Functions

    // Function to buy Data
    function buyData(uint256 _id) public payable {
        Data storage data = dataObjectsById[_id];

        require(data.isForSale, "Data is not for sale");
        require(msg.value == data.price, "Insufficient amount");
        require(data.owner != msg.sender, "You already own this data");

        address payable previousOwner = data.owner;
        data.owner = payable(msg.sender);

        // Transfer payment to the previous owner
        previousOwner.transfer(msg.value);
    }

    // Function to buy Model
    function buyModel(uint256 _id) public payable {
        Model storage model = modelObjectsById[_id];

        require(model.isForSale, "Model is not for sale.");
        require(msg.value == model.price, "Insufficient amount");
        require(model.owner != msg.sender, "You already own this model");

        address payable previousOwner = model.owner;
        model.owner = payable(msg.sender);

        // Transfer payment to the previous owner
        previousOwner.transfer(msg.value);
    }

    // Functions to retrieve objects by their id
    function getDataDetails(uint256 _id) public view returns (Data memory) {
        return dataObjectsById[_id];
    }

    function getModelDetails(uint256 _id) public view returns (Model memory) {
        return modelObjectsById[_id];
    }

    function getComputeResourceDetails(
        uint256 _id
    ) public view returns (ComputeResource memory) {
        return computeResourceObjectsById[_id];
    }

    function getJobDetails(uint256 _id) public view returns (Job memory) {
        return jobObjectsById[_id];
    }

    // Function to fetch Data objects for msg.sender
    function fetchMyData() public view returns (Data[] memory) {
        uint256 count = dataIdCounter.current();
        Data[] memory myData = new Data[](count);

        for (uint256 i = 1; i <= count; i++) {
            Data storage data = dataObjectsById[i];
            if (data.owner == msg.sender) {
                myData[i - 1] = data;
            }
        }

        return myData;
    }

    // Function to fetch Model objects for msg.sender
    function fetchMyModels() public view returns (Model[] memory) {
        uint256 count = modelIdCounter.current();
        Model[] memory myModels = new Model[](count);

        for (uint256 i = 1; i <= count; i++) {
            Model storage model = modelObjectsById[i];
            if (model.owner == msg.sender) {
                myModels[i - 1] = model;
            }
        }

        return myModels;
    }

    // Function to fetch ComputeResource objects for msg.sender
    function fetchMyComputeResources()
        public
        view
        returns (ComputeResource[] memory)
    {
        uint256 count = computeResourceIdCounter.current();
        ComputeResource[] memory myComputeResources = new ComputeResource[](
            count
        );

        for (uint256 i = 1; i <= count; i++) {
            ComputeResource
                storage computeResource = computeResourceObjectsById[i];
            if (computeResource.owner == msg.sender) {
                myComputeResources[i - 1] = computeResource;
            }
        }

        return myComputeResources;
    }

    // Function to fetch Job objects for msg.sender
    function fetchMyJobs() public view returns (Job[] memory) {
        uint256 count = jobIdCounter.current();
        Job[] memory myJobs = new Job[](count);

        for (uint256 i = 1; i <= count; i++) {
            Job storage job = jobObjectsById[i];
            if (job.owner == msg.sender) {
                myJobs[i - 1] = job;
            }
        }

        return myJobs;
    }

    // Functions to get all resources

    // Function to get all for sale Data objects
    function fetchAllForSaleData() public view returns (Data[] memory) {
        uint256 count = dataIdCounter.current();
        Data[] memory forSaleData = new Data[](count);

        uint256 forSaleDataIndex = 0;
        for (uint256 i = 1; i <= count; i++) {
            Data storage data = dataObjectsById[i];
            if (data.isForSale) {
                forSaleData[forSaleDataIndex] = data;
                forSaleDataIndex++;
            }
        }

        return forSaleData;
    }

    // Function to get all active Model objects
    function fetchAllForSaleModels() public view returns (Model[] memory) {
        uint256 count = modelIdCounter.current();
        Model[] memory forSaleModels = new Model[](count);

        uint256 forSaleModelIndex = 0;
        for (uint256 i = 1; i <= count; i++) {
            Model storage model = modelObjectsById[i];
            if (model.isForSale) {
                forSaleModels[forSaleModelIndex] = model;
                forSaleModelIndex++;
            }
        }

        return forSaleModels;
    }

    // Function to get all active ComputeResource objects
    function getAllActiveComputeResources()
        public
        view
        returns (ComputeResource[] memory)
    {
        uint256 count = computeResourceIdCounter.current();
        ComputeResource[] memory activeComputeResources = new ComputeResource[](
            count
        );

        uint256 activeComputeResourceIndex = 0;
        for (uint256 i = 1; i <= count; i++) {
            ComputeResource
                storage computeResource = computeResourceObjectsById[i];
            if (computeResource.isActive) {
                activeComputeResources[
                    activeComputeResourceIndex
                ] = computeResource;
                activeComputeResourceIndex++;
            }
        }

        return activeComputeResources;
    }

    // Function to fetch Job objects for msg.sender
    function fetchAllJobs() public view returns (Job[] memory) {
        uint256 count = jobIdCounter.current();
        Job[] memory myJobs = new Job[](count);

        for (uint256 i = 1; i <= count; i++) {
            Job storage job = jobObjectsById[i];
            myJobs[i - 1] = job;
        }

        return myJobs;
    }

    // Helper functions

    function calculateComputeResourceScore(
        uint256 _ram,
        uint256 _gpu
    ) internal pure returns (uint256) {
        return _ram + _gpu * 2;
    }

    // Custom implementation to avoid importing
    function uintToStr(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }

        return string(buffer);
    }
}
