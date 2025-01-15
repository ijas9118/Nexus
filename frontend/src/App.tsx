import React from "react";
import LoginPage from "./pages/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/normal/Home";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
