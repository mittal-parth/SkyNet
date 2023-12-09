import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";
import ModelCard from "../components/ModelCard";
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

const ModelRow = () => {
  const [modelObjects, setmodelObjects] = useState([]);
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function fetchmodelObjects() {

    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: skynetABI,
      functionName: "fetchAllForSaleModels",
    });
    let modelObjectsList = []
    if (walletClient && data != null) {
      data.map((element,index) => {
          console.log("model",element)
          modelObjectsList.push(element)
      });
        setmodelObjects(modelObjectsList)
    } else {
      console.log("No data found");
    }
  }

  useEffect(() => {
    if (isLoading && walletClient) {
      return;
    }
    fetchmodelObjects();
  }, [isLoading]);
  return (
    <section id="data-market" className={layout.sectionReverse}>
      {isLoading? <div className="text-white">Loading</div> : 
      <div className="flex-col px-30 justify-center w-full">
        <div className="font-poppins text-center mr-2 text-5xl text-white text-gradient-3">
          Model Market
        </div>
      <div className="w-full inline-flex flex-nowrap justify-center mx-10 my-10 animate-infinite-scroll">
        {(modelObjects && modelObjects.length > 0 )? modelObjects.map((element,index)=>{
          return (<ModelCard modelObject={element} isOwner={false} key={index} />);
        }): <div className="font-poppins mr-2 text-4xl text-white">No data found</div>}
      </div>
    </div>}
    </section>
  );
};
export default ModelRow;
