import React from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";

// PushAPI.initialize(signer, {options?});
// signer - pass the signer from your app and set env to 'CONSTANTS.ENV.PROD' for mainnet app
// options? - optional, can pass initialization parameters for customization

// Be sure to set `build.withGlobalTauri` in `tauri.conf.json` to true
// const invoke = window.__TAURI__.invoke

export default function GetNotifs() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);

  const { data: walletClient, isError, isLoading } = useWalletClient();

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
    setNotifs(sample);
  }
  // const { data: signer } = useSigner();

  useEffect(() => {
    if (walletClient) fetchNotifs();
  }, [walletClient]);
  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      <div className="space-y-4 w-full max-w-sm">
        {notifs.map((notif, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{notif.title}</h3>
              <p className="text-gray-300">{notif.message}</p>
            </div>
            <div className="bg-gray-700 p-3 flex justify-between">
              <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded transition duration-150">
                Accept
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded transition duration-150">
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
