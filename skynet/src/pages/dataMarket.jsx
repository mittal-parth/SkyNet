import React from "react";
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
  // const { data: walletClient, isError, isLoading } = useWalletClient()
  // console.log(walletClient, isLoading);
  // const signer = useEthersSigner(80001, walletClient);
  // console.log(signer);

  const navigate = useNavigate();
  const [dataObjects, setdataObjects] = useState([]);
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function fetchDataObjects() {
    const signer = await getWalletClient({chainId: 80001});

    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: skynetABI,
      functionName: 'fetchMyData',
    })
    console.log(data)
    // console.log(walletClient)
    // try {

    //   // const contract = getContract({
    //   //   address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    //   //   abi: ensRegistryABI,
    //   //   signer,
    //   // })
    //   // console.log(signer);
    //   console.log(walletClient);
    //   const dataObjects = await contractCall("fetchMyData", [], signer);
    //   console.log(dataObjects.data);
    // } catch (err) {
    //   console.log(err);
    //   // setSnackbarInfo({ ...snackbarInfo, open: true, message: `Error ${err.code}: ${err.message}` })
    // }
  }

  useEffect(() => {
    if(isLoading) {
      return;
    }
    console.log(walletClient)
    fetchDataObjects();
  }, [isLoading]);

  const tempDataList = [
    {
      dataname: "Sensor",
      description: "This is a sensor data of a car",
      price: 100,
      columns: [
        "time",
        "speed",
        "rpm",
        "fuellong",
        "temp",
        "time",
        "speedlong",
        "rpmlong",
      ],
      isActive: true,
    },
    {
      dataname: "Flowers",
      description: "This is a collection of all flowers",
      price: 1000,
      columns: ["colour", "size", "type"],
      isActive: false,
    },
    {
      dataname: "Weather",
      description: "This is weather data",
      price: 500,
      columns: ["temperature", "humidity", "wind_speed", "precipitation"],
      isActive: true,
    },
    {
      dataname: "Stocks",
      description: "Stock market data",
      price: 800,
      columns: ["symbol", "price", "volume", "change_percentage"],
      isActive: false,
    },
    {
      dataname: "SocialMedia",
      description: "Social media activity",
      price: 300,
      columns: ["user_id", "post_count", "followers", "likes"],
      isActive: true,
    },
  ];

  return (
    <div className="px-30">
      <div className="flex items-center ">
        <div className="font-poppins  mr-2 text-4xl text-white">
          Data Market
        </div>
        <IoIosAddCircleOutline size={40} color="green" />
      </div>
      <div className="flex flex-wrap mx-10 my-10">
        {tempDataList.map((data) => {
          return <DataCard data={data} isOwned={true} />;
        })}
      </div>
      <div className="mx-10 my-10">{/* <ModelCard/> */}</div>
      <div className="flex items-center">
        <div className="font-poppins mr-2 text-4xl text-white">My data</div>
        <a onClick={() => navigate("/uploaddata")}>
          <IoIosAddCircleOutline size={40} color="green" />
        </a>
      </div>
      <div className="flex flex-wrap mx-10 my-10">
        {tempDataList.map((data) => {
          return <DataCard data={data} isOwned={false} />;
        })}
      </div>
    </div>
  );
};

export default DataMarket;
