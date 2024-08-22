import React from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FormData from "./Components/FormData";
import Signup from "./Components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/formdata" element={<FormData />} /> 
      </Routes>
    </Router>
  );
}
export default App;
