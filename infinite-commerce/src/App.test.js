import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import './App.css';
import Home from "./homepage";
import AutoSuggest from 'react-autosuggest'

it("renders without crashing", function() {
    render(<App />);
  });