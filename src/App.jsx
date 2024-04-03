import React from "react";
import UserRegister from "./Components/UserRegister";
import UserLogin from "./Components/UserLogin";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgetPassword from "./Components/ForgetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* Add a default route for the root URL */}
        <Route path="/" element={<UserLogin />} />
        {/* You can add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
