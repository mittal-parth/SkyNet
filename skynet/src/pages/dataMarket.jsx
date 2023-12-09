import React from "react";
import { ethers } from "ethers";

import DataCard from "../components/DataCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import { contractCall } from "../utils";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
// import { useEthersSigner } from "../utils";
import { getWalletClient , getPublicClient } from "@wagmi/core";
import { readContract } from '@wagmi/core'
import { CONTRACT_ADDRESS} from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;


const DataMarket = () => {

  const navigate = useNavigate();
  const [dataObjects, setdataObjects] = useState([]);
  const [ownerDataObjects,setOwnerDataObjects] = useState([]);
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function fetchDataObjects() {
    setdataObjects([]);
    setOwnerDataObjects([]);

    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: skynetABI,
      functionName: "fetchAllForSaleData",
    })

    if(walletClient && data != null){
      data.map((element) => {
        console.log("element is ",element.owner == walletClient.account.address)
        console.log("wallet address is",walletClient.account.address)

        if(walletClient && element.owner==walletClient.account.address){
          element.columns = ["time","speed","rpm","fuellong","temp","time","speedlong","rpmlong"];
          ownerDataObjects ? setOwnerDataObjects([...ownerDataObjects,element]) : setOwnerDataObjects([element])

        }else{
          element.columns =["time","speed","rpm","fuellong","temp","time","speedlong","rpmlong"];
          // To be removed
          dataObjects ? setdataObjects([...dataObjects,element]) : setdataObjects([element])
        }
      });
    }else{
      console.log("No data found")
    }
    

  }

  useEffect(() => {
    if(isLoading && walletClient) {
      return;
    }

    fetchDataObjects();
  }, [isLoading]);
  console.log("Data Objects are ",dataObjects)
  console.log("Owner Data Objects are ",ownerDataObjects)
  return (
    <div className="px-30">
      <div className="flex items-center ">
        <div className="font-poppins  mr-2 text-4xl text-white">
          Data Market
        </div>
        <IoIosAddCircleOutline size={40} color="green" />
      </div>
      <div className="flex flex-wrap mx-10 my-10">
        {(dataObjects && dataObjects.length > 0 )? dataObjects.map((element)=>{
          return <DataCard dataObject={element} isOwner={false}  />;
        }): <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
      </div>
      <div className="mx-10 my-10">{/* <ModelCard/> */}</div>
      <div className="flex items-center">
        <div className="font-poppins mr-2 text-4xl text-white">My data</div>
        <a onClick={() => navigate("/uploaddata")}>
          <IoIosAddCircleOutline size={40} color="green" />
        </a>
      </div>
      <div className="flex flex-wrap mx-10 my-10">
        {ownerDataObjects && ownerDataObjects.length != 0 ?<div> {ownerDataObjects.map((element,index) => {
          return <DataCard dataObject={element} isOwner={true} key={index}/>
        }) }</div>: <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
      </div>
    </div>
  );
};

export default DataMarket;
