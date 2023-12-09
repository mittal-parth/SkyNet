import React from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContractWrite } from "wagmi";
import { CONTRACT_ADDRESS } from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;
// PushAPI.initialize(signer, {options?});
// signer - pass the signer from your app and set env to 'CONSTANTS.ENV.PROD' for mainnet app
// options? - optional, can pass initialization parameters for customization

// Be sure to set `build.withGlobalTauri` in `tauri.conf.json` to true
// const invoke = window.__TAURI__.invoke

export default function GetNotifs() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(() => new Set());
  // const [jobRequests, setJobRequests] = useState(() => new Set())

  const { data: walletClient, isError } = useWalletClient();

  async function fetchNotifs() {
    const user = await PushAPI.initialize(walletClient, {
      env: CONSTANTS.ENV.STAGING,
    });
    const inboxNotifications = await user.notification.list("INBOX");
    // push last 3 notifs to setNotifs
    let sample = inboxNotifications.slice(-3);
    // only select the message field and title field
    sample = sample.map((notif) => {
      return { message: notif.message, title: notif.title };
    });
    setNotifs((notifs) => {
      const _notifs = new Set(notifs)
      _notifs.add(sample)
      return _notifs
    });
  }
  // const { data: signer } = useSigner();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: skynetABI,
    functionName: 'addComputeResourceIdToJob',
  })

  useEffect(() => {
    console.log(data, isError, isSuccess)
  }, [isLoading, isSuccess, data])

  const signUpForJob = (jobId) => {
    console.log("Signing up ...")
    write({
      args: [jobId, walletClient.account.address],
      from: walletClient.account.address
    })
  }

  const rejectJob = (notif) => {
    setNotifs((notifs) => {
      const _notifs = new Set(notifs)
      _notifs.delete(notif)
      return _notifs 
    })
  }
  
  useEffect(() => {
    if (walletClient) fetchNotifs();
  }, [walletClient]);
  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      <div className="space-y-4 w-full max-w-sm">
        {Array.from(notifs).map((notif, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{notif.title}</h3>
              <p className="text-gray-300">{notif.message}</p>
            </div>
            <div className="bg-gray-700 p-3 flex justify-between">
              <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded transition duration-150"
              onClick={() => {signUpForJob(notif.message)}}>
                Accept
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded transition duration-150"
              onClick={() => {rejectJob(notif)}}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/job")}
        className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition duration-150"
      >
        Create Job
      </button>
    </div>
  );
}
