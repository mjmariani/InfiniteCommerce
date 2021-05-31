import './App.css';
import React from "react";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import Home from "./homepage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
