import {Routes, Route } from "react-router-dom";
import DataMarket from "./pages/dataMarket";
import JobPage from "./pages/JobPage";
const App = () => {
  return (
    <Routes>
        <Route path="/" element={<JobPage />} />
        <Route path="/data" element={<DataMarket />} />
      
        </Routes>
  )
}

export default App;