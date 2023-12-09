import React from 'react';
import DataCard from '../components/DataCard';
import ModelCard from '../components/ModelCard';
import { IoIosAddCircleOutline } from "react-icons/io";
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
// import { useEthersSigner } from "../utils";
import { getWalletClient , getPublicClient } from "@wagmi/core";
import { readContract } from '@wagmi/core'
import { CONTRACT_ADDRESS} from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;


const ModelMarket = ()=> {
  const navigate = useNavigate();
  const [modelObjects, setModelObjects] = useState([]);
  const [ownerModelObjects,setOwnerModelObjects] = useState([]);
  const { data: walletClient, isError, isLoading } = useWalletClient();
  async function fetchModelObjects() {
    setModelObjects([]);
    setOwnerModelObjects([]);
    const signer = await getWalletClient({chainId: 80001});

    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: skynetABI,
      functionName: "fetchAllForSaleModels",
    })

    if(data != null){
      data.map((element) => {
        if(element.owner==walletClient.account.address){
          element.isOwner=true;
          setOwnerModelObjects([...ownerModelObjects,element])

        }else{
          element.isOwner=false;

          setModelObjects([...modelObjects,element])
        }
      });
    }else{
      console.log("No model found")
    }
  }

  useEffect(() => {
    if(isLoading) {
      return;
    }

    fetchModelObjects();
  }, [isLoading]);
  console.log(modelObjects , "modelObjects2")
    return (
        <>
        
        <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl text-white'>
        Models Market
      </div>
      <IoIosAddCircleOutline size={40} color='green'/>
        </div>
            <div className='flex flex-wrap mx-10 my-10'>
            {(modelObjects && modelObjects.length > 0 )? modelObjects.map((element)=>{
              console.log(element , "element")
          return <ModelCard modelObject={element} />;
        }): <div className="font-poppins mr-2 text-4xl text-white">No model found</div>}

            </div>
            <div className='mx-10 my-10'>

            </div>
            <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl text-white'>
        My models
      </div>
      <a onClick={() => navigate('/uploadmodel')}><IoIosAddCircleOutline size={40} color='green'/></a>
        </div>
        <div className='flex flex-wrap mx-10 my-10'>
        {ownerModelObjects && ownerModelObjects.length != 0? ownerModelObjects.forEach((element) => {
          console.log(data.title)
          return <ModelCard modelObject={element} />;
        }) : <div className="font-poppins mr-2 text-4xl text-white">No model found</div>}

            </div>
            </>
    );
}

export default ModelMarket;
