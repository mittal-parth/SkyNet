import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";
import DataCard from "../components/DataCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import { contractCall } from "../utils";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
// import { useEthersSigner } from "../utils";
import { getWalletClient, getPublicClient } from "@wagmi/core";
import { readContract } from "@wagmi/core";
import { CONTRACT_ADDRESS } from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI = ABI.abi;

const DataRow = () => {
  const navigate = useNavigate();
  const [dataObjects, setdataObjects] = useState([]);
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function fetchDataObjects() {

    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: skynetABI,
      functionName: "fetchAllForSaleData",
    });
    let dataObjectsList = []
    if (walletClient && data != null) {
      data.map((element,index) => {

          element.columns = ["time","speed","rpm","fuellong","temp","time","speedlong","rpmlong",];
          dataObjectsList.push(element)
      });
        setdataObjects(dataObjectsList)
    } else {
      console.log("No data found");
    }
  }

  useEffect(() => {
    if (isLoading && walletClient) {
      return;
    }
    fetchDataObjects();
  }, [isLoading]);
  return (
    <section id="data-market" className={layout.sectionReverse}>
      {isLoading? <div className="text-white">Loading</div> : 
      <div className="flex-col px-30 justify-center w-full">
        <div className="font-poppins text-center mr-2 text-6xl text-white text-gradient-3 mb-2">
          Data Market
        </div>
        <div class="w-full inline-flex flex-nowrap ">
      <div className="w-full inline-flex flex-nowrap justify-center mx-10 my-5 animate-infinite-scroll ">
        {(dataObjects && dataObjects.length > 0 )? dataObjects.map((element,index)=>{
            console.log(dataObjects.length)
          return (<DataCard dataObject={element} isOwner={false} key={index} />);
        }): <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
      </div>
      <div className="w-full inline-flex flex-nowrap justify-center mx-10 my-5 animate-infinite-scroll">
        {(dataObjects && dataObjects.length > 0 )? dataObjects.map((element,index)=>{
            console.log(dataObjects.length)
          return (<DataCard dataObject={element} isOwner={false} key={index} />);
        }): <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
      </div>
      </div>
      {/* <div class="w-full inline-flex flex-nowrap justify-center mx-10 my-5">
    <ul class="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
    {(dataObjects && dataObjects.length > 0 )? dataObjects.map((element,index)=>{
            console.log(dataObjects.length)
          return (<li><DataCard dataObject={element} isOwner={false} key={index} /></li>);
        }): <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
    </ul>
    </div> */}
    </div>}
    </section>
  );
};
export default DataRow;
