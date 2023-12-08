import { Routes, Route } from "react-router-dom";
import DataMarket from "./pages/dataMarket";
import ModelMarket from "./pages/ModelMarket";
import JobPage from "./pages/JobPage";
import UploadData from "./pages/UploadData";
import UploadModel from "./pages/UploadModel";
import GetNotifs from "./pages/GetNotifs";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const App = () => {
  return (
    <>
      <ConnectButton />
      <Routes>
        <Route path="/" element={<GetNotifs />} />
        <Route path="/data" element={<DataMarket />} />
        <Route path="/model" element={<ModelMarket />} />
        <Route path="/uploaddata" element={<UploadData />} />
        <Route path="/uploadmodel" element={<UploadModel />} />
      </Routes>
    </>
  );
};

export default App;
