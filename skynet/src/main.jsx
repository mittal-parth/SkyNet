import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrumGoerli } from "wagmi/chains";
import {  publicProvider } from "wagmi/providers/public";

import "./styles.css";

const { chains, publicClient } = configureChains(
  [arbitrumGoerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SkyNet",
  projectId: "a1c28fc1baf7163b3eeb70ce56c11a81",
  chains,
});
console.log(connectors)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  // </React.StrictMode>
);
