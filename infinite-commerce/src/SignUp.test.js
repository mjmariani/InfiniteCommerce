import "./SignUp.css";
import AlertDismissible from "./AlertDismissible";
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import CommerceAPI from "./api";
import { useHistory } from "react-router-dom";
import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";
import SignUp from "./SignUp";
import { render } from "@testing-library/react";

it("renders without crashing", function() {
    render(<SignUp />);
  });