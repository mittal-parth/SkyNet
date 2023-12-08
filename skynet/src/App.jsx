import {Routes, Route } from "react-router-dom";
import DataMarket from "./pages/dataMarket";
import ModelMarket from "./pages/ModelMarket";
import JobPage from "./pages/JobPage";
import UploadData from "./pages/UploadData";
const App = () => {
  return (
    <Routes>
        <Route path="/" element={<JobPage />} />
        <Route path="/data" element={<DataMarket />} />
        <Route path="/model" element={<ModelMarket />} />
        <Route path="/uploaddata" element={<UploadData />} />


      
        </Routes>
  )
}

export default App;