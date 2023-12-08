import {Routes, Route } from "react-router-dom";
import Data from "./pages/datapage";
import JobPage from "./pages/JobPage";
const App = () => {
  return (
    <Routes>
        <Route path="/" element={<JobPage />} />
      
        </Routes>
  )
}

export default App;