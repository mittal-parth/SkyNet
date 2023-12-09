import { ethers } from "ethers";
import { CONTRACT_ADDRESS} from "./config";
import ABI from "./constants/skynetabi.json";
const skynetABI=ABI.abi;
const {ethereum} = window;
import { useWalletClient } from 'wagmi'
import { useMemo } from "react";

export const getContract = (walletClient) => {
//   const provider = new ethers.providers.Web3Provider(ethereum);
//   const signer = provider.getSigner();
//   const { data: walletClient, isError, isLoading } = useWalletClient()
  const SKYNET = new ethers.Contract(
    CONTRACT_ADDRESS,
    skynetABI,
    walletClient
  );
//   console.log("SKYNET", signer);



  return SKYNET;
};

export function walletClientToSigner(walletClient) {
    const { account, chain, transport } = walletClient
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new ethers.providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
  }
   
  /** Hook to convert a viem Wallet Client to an ethers.js Signer. */
  export function useEthersSigner({ chainId, walletClient }) {
    // const { data: walletClient } = useWalletClient({ chainId })
    return useMemo(
      () => (walletClient ? walletClientToSigner(walletClient) : undefined),
      [walletClient],
    )
  }

export const contractCall = async (func, params = [], walletClient) => {

  const contract = getContract(walletClient);

  try {
    let data = await eval(`contract.${func}`)(...params);
    return {
      status: 200,
      data: data,
    };
  } catch (e) {
    console.log("contractCall debug:", e);
    const error = Error("Something went wrong");
    error.code = 500;
    throw error;
  }
};




export const getChallengeStatusCode = (status) => {
  const map = {
    OPEN: 0,
    ALLOTED: 1,
    REJECTED: 2,
    SUCCESSFUL: 3,
  };
  return map[status];
};

export const getChallengeStatus = (code) => {
  const map = {
    0: "OPEN",
    1: "ALLOTED",
    2: "REJECTED",
    3: "SUCCESSFUL",
  };
  return map[code];
};

export const getStatusCode = (code, type = 0) => {
  const map = {
    0: "OPEN",
    1: "LOCKED",
    2: "CLOSED",
  };

  const colourMap = {
    0: "bg-primary",
    1: "bg-yellow",
    2: "bg-red"
  }
  return type ? colourMap[code]:map[code];
}

export const getStatusColor = (code) => {
  const map = {
    0: "border-yellow",
    1: "border-blue",
    2: "border-red",
    3: "border-primary",
  };
  return map[code];
};

export const CAROUSEL_RESPONSIVE_SETTINGS = {
  lg: {
    breakpoint: { max: 3000, min: 1500 },
    items: 4,
  },
  md: {
    breakpoint: { max: 1500, min: 1200 },
    items: 3,
  },
  sm: {
    breakpoint: { max: 1200, min: 720 },
    items: 2,
  },
  xs: {
    breakpoint: { max: 720, min: 0 },
    items: 1,
  }
}

export const switchNetwork = async (auth, network) => {
  try {
    if (auth.provider.chainId !== network.chainId) {
      await auth.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    }
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await auth.provider.request({
          method: "wallet_addEthereumChain",
          params: [network],
        });
        await switchNetwork(auth, network);
      } catch (addError) {
        console.log(addError);
      }
    }
    console.log(switchError);
  }
};



export const truncate = (string, length) => {
  if (string.length > length) {
    return string.substring(0, length) + "...";
  }
  return string;
};