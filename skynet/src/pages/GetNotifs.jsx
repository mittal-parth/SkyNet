import React from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
// PushAPI.initialize(signer, {options?});
// signer - pass the signer from your app and set env to 'CONSTANTS.ENV.PROD' for mainnet app
// options? - optional, can pass initialization parameters for customization
export default function GetNotifs() {
  const [notifs, setNotifs] = useState([]);

  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function fetchNotifs() {
    // const { data: signer } = useSigner();

    const user = await PushAPI.initialize(walletClient, {
      env: CONSTANTS.ENV.STAGING,
    });
    const stream = await user.initStream([CONSTANTS.STREAM.NOTIF], {
      filter: {
        channels: ["*"], // pass in specific channels to only listen to those
        chats: ["*"], // pass in specific chat ids to only listen to those
      },
      connection: {
        retries: 3, // number of retries in case of error
      },
      raw: false, // enable true to show all data
    });

    // Listen for notifications events
    stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
      [data].concat(notifs);
    });
    stream.connect();
  }

  useEffect(() => {
    if (walletClient) fetchNotifs();
  }, [walletClient]);
  return (
    <div>
      <h1>Notifications</h1>
      <h2>{notifs}</h2>
    </div>
  );
}
