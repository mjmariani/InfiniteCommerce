import "./searchBar.css";
import React, { useState, useEffect, useContext, useCallback } from "react";

//Source for autocomplete code: https://www.freakyjolly.com/autocomplete-suggestion-control-using-react-autosuggest/
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import {
    Button, Input, Form, FormGroup, Label
} from "reactstrap";
import { makeStyles, IconButton, Collapse } from '@material-ui/core';


//Note: implement autocomplete feature later on

function SearchBar ({ searchData, error, filterData }) {
    
    let [data, setData] = useState('');

    let params = {
        api_key: "2D5E73AFE55F452888AC418D292FD570",
        type: "search",
        amazon_domain: "amazon.com",
    };

    // const { useState, useRef } = React

    // const Counter = () => {
    // const [count, setCount] = useState(0)
    // const counterEl = useRef(null)

    // const increment = () => {
    // setCount(count + 1)
    // console.log(counterEl)
    // }

    // if(nextPage === true){
    //     increment();
    //     params.page = `${count}`;
    //     nextPage = false;
    // }
    
    // Calling External API to get product data
    let getSuggestions = async (value) => {
        //isLoading();
        params.search_term = `${data}`;
        if(filterData.sort_by != '' ){
            params = { ...params, sort_by: filterData.sort_by[0] }
        }else if(filterData.customer_location != ''){
            params = { ...params, customer_location: filterData.customer_location[0] }
        }
        const inputValue = value.trim().toLowerCase();
        try{
            console.log(params);
            //console.log("calling API");
            let response = await axios.get('https://api.rainforestapi.com/request', { params })
            
            let data = response.data.search_results;
            //console.log(data);
            //isLoading();
            //console.log('not loading');
            searchData(data);
        }catch(error){
            //isLoading();
            error(error.message);
        }
    };

  
        return (<Form className="search-form" onSubmit={(evt)=>{evt.preventDefault(); getSuggestions(data);}}>
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

export default SearchBar;