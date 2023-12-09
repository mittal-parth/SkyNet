import React from "react";
import { ethers } from "ethers";

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
import DataMarket  from "./dataMarket";
import ModelMarket  from "./ModelMarket";
const Market = () => {
const [currentTab, setCurrentTab] = useState(0);
  return (
    <div className="px-30">
      <div >
      <ul className="flex justify-center text-sm font-medium text-center text-gray-500 dark:text-gray-400 w-full ">
        <li className={`me-2 mr-20  ${currentTab == 0 ?" shadow-2xl shadow-blue-500 rounded-lg  ":""}`}>
          <a
          onClick={() => {setCurrentTab(0)}}

            class={`inline-block px-10 py-3  text-white rounded-lg active data-card  text-white hover:text-white   `}
            aria-current="page"
          >
            Data
          </a>
        </li>
        <li className={`me-2  ${currentTab == 1 ?" shadow-2xl shadow-blue-500 rounded-lg ":""}`}>
          <a
          onClick={() => {setCurrentTab(1)}}
            className="inline-block px-10 py-3 data-card rounded-lg text-white hover:text-white"
          >
            Model
          </a>
        </li>
      </ul>

      </div>
        <div>
            {currentTab == 0 ? <DataMarket /> : <ModelMarket />}
        </div>
    </div>
  );
};

export default Market;
