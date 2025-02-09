import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/User/Login/Login";
import SignUp from "./pages/User/SignUp/SignUp";
import Board from "./pages/Board/Board";

import "./App.css";
import PostDetail from "./pages/Board/PostDetail";
import PostWrite from "./pages/Board/PostWrite";
import MyPage from "./pages/MyPage/MyPage";
import Policy from "./pages/User/Policy";


function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      
        <Route path="/board/:category" element={<Board/>} /> 
        <Route path="/board/:category/:id" element={<PostDetail />} />
        <Route path="/board/edit/:category/:id" element={<PostWrite />} />
        <Route path="/board/new/:category" element={<PostWrite />} />

        <Route path="/mypage" element={<MyPage />} />

        <Route path="/privacy-policy" element={<Policy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
