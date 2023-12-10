# SkyNet
## Problem
As said by Forbes, the future of AI will lie in the hands of the one with access to the most powerful computing resources. More and more users will need to train more and more advanced models.

What if you could have a decentralised method to train the same machine learning model, with the epochs and data split across different machines across the internet? SkyNet aims to solve that, enhanced with the power of zk.

Existing solutions like hivemind have a steep usage curve and are restricted to just a local network of machines. Federated learning is again restricted to a local network (unless the private IPs are exposed) and is more focused on data privacy.

SkyNet has the following flow, coupled with the power of zero-knowledge proofs:

Choose or upload Data
Select a Model from Marketplace (For Inference) or Upload Model Architecture for training.
Specify the computing resources requirements and budget.
A Push Notification is sent to all interested participants
When Requirements are met, the task is assigned to all participants and logged in the smart contract.
The workflow is managed using Waku's P2P stack to ensure a reliable mode of communication which enables end-to-end delivery confirmations and uniquely identifies nodes in the subnet. It is used in the exchange of weights during the training process without revealing the same to anyone else.
Every model trained has a zkProof Verifier Contract generated. Proofs are generated for every worker running the model. These proofs can be verified by the contract deployed on the Scroll zkEVM.

## Challenges we ran into
During the course of our project development, we encountered several challenges that required thoughtful resolution:

Peer-to-Peer Connection with Waku:
Establishing a reliable peer-to-peer connection with Waku proved challenging due to intermittent failures in the relay server. This hurdle necessitated thoroughly examining the server's reliability issues and implementing robust measures to ensure consistent and dependable connections.

Integration of Project Components:
Efficiently consolidating various project components posed a significant challenge.

File Upload Using Lighthouse:
Overcoming difficulties in file uploads through Lighthouse emerged as a pivotal concern. Thanks to mentorship, we successfully addressed this challenge by leveraging valuable guidance.
### Decentralised ML across the internet, powered by ZK.
## Network Diagram :
![WhatsApp Image 2023-12-10 at 07 14 24](https://github.com/mittal-parth/SkyNet/assets/72497928/cdecc03a-9944-4507-8166-af737e020c88)

## Images
![image](https://github.com/mittal-parth/SkyNet/assets/75673036/0aebc0fd-f1c5-4db6-aa32-9daa62a42ad9)
![image](https://github.com/mittal-parth/SkyNet/assets/75673036/3bb9848b-b2b7-4961-9daa-e175fcb2d573)
![image](https://github.com/mittal-parth/SkyNet/assets/75673036/a8a8457d-2824-4f4a-9953-5716b15b64fe)
![image](https://github.com/mittal-parth/SkyNet/assets/75673036/06cb3456-b257-4ecb-82b8-7e54ad0e84ba)
![image](https://github.com/mittal-parth/SkyNet/assets/75673036/83a0d6dd-3ccb-4797-971e-5ba1a7b864ec)

