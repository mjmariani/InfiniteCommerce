import './homepage.css';
import NavBar from "./NavBar";
import Info from "./Info";
import MoreInfo from "./moreInfo";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import EditProfile from "./EditProfile";
import ProductPage from "./productPage";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { render } from "@testing-library/react";
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";
import homepage from "./homepage";

it("renders without crashing", function() {
    render(<homepage />);
  });