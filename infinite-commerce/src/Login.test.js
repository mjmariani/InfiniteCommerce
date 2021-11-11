import "./LogIn.css";
import AlertDismissible from "./AlertDismissible";
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import CommerceAPI from "./api";
import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";
import Login from "./Login";
import { render } from "@testing-library/react";

it("renders without crashing", function() {
    render(<Login />);
  });