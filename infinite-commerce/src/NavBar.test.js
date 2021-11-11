import "./NavBar.css";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
//import { Navbar, Nav, NavItem, Container } from "reactstrap";
//import userContext from "./userContext"
//import ShoppingCartProductCard from "./shoppingCartProductCard";
import { Navbar, Container, Nav } from 'react-bootstrap'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import {useSelector, useDispatch} from "react-redux";
import {selectUser, logoutState} from "./features/userSlice";
import SideDrawer from "./SideDrawer";
import NavBar from "./NavBar";
import { render } from "@testing-library/react";

it("renders without crashing", function() {
    render(<NavBar />);
  });