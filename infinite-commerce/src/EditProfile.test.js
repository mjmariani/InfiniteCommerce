import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import "./EditProfile.css";
import { Redirect } from "react-router-dom";
import React, {useState} from 'react';
import CommerceAPI from "./api";
import {useSelector, useDispatch} from "react-redux";
import {selectUser, logoutState} from "./features/userSlice";
import { loginState } from "./features/userSlice";
import EditProfile from "./EditProfile";
import { render } from "@testing-library/react";

it("renders without crashing", function() {
    render(<EditProfile />);
  });