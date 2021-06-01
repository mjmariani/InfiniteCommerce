import React, { useState, useEffect, useContext, useCallback } from "react";
import "./searchBar.css";
//Source for autocomplete code: https://www.freakyjolly.com/autocomplete-suggestion-control-using-react-autosuggest/
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import {
    Button, Input, Form, FormGroup, Label
} from "reactstrap";
import { makeStyles, IconButton, Collapse } from '@material-ui/core';


//Re-write into modern React using hooks later on using useEffect and useState

function SearchBar ({ searchData }) {
    let [results, setResults] = useState(searchData);
    let [data, setData] = useState('');
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");

    const params = {
        api_key: "2D5E73AFE55F452888AC418D292FD570",
        type: "search",
        amazon_domain: "amazon.com",
        sort_by: "price_low_to_high"
    };

    const updateLoading = () => setLoading(!loading);
    const setErrorMsg = (message) => setError(message)
    const setResultsData = (data) => setResultsData(data)

    // Calling External API to get product data
    let getSuggestions = async (value) => {
        updateLoading();
        const inputValue = value.trim().toLowerCase();
        try{
            let response = axios.get('https://api.rainforestapi.com/request', { ...params, search_term: `${inputValue}`, })
            let data = await JSON.stringify(response.search_results);
            updateLoading();
            setResultsData(data);
        }catch(error){
            updateLoading();
            setErrorMsg(error.message);
        }
    };

        // Adding AutoSuggest component
        if(loading === true){
            return (<h1>Loading...</h1>) 
        }else if(error != ''){
            
            return (
            <>
            
            <div class="alert alert-danger">
                <strong>{error.message}</strong> 
            </div>
            <Form onSubmit={(evt)=>{evt.preventDefault(); getSuggestions(data);}}>
            <Label htmlFor="header-search"> 
            <span className="visually-hidden">Search products</span>
            </Label>
            <Input
            type="text"
            id="header-search"
            placeholder="Search products"
            name="search"
            value= {data}
            onChange={e => setData(e.target.value)} 
            />
            <Button type="submit">Search</Button>
            </Form>
            </>)
        }
        else{
                return (<Form onSubmit={(evt)=>{evt.preventDefault(); getSuggestions(data);}}>
                <Label htmlFor="header-search"> 
                <span className="visually-hidden">Search products</span>
                </Label>
                <Input
                type="text"
                id="header-search"
                placeholder="Search products"
                name="search"
                value= {data}
                onChange={e => setData(e.target.value)} 
                />
                <Button type="submit">Search</Button>
                </Form>)
        }
}

export default SearchBar;