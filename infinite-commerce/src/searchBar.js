import "./searchBar.css";
import React, { useState } from "react";
//Source for autocomplete code: https://www.freakyjolly.com/autocomplete-suggestion-control-using-react-autosuggest/
//import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import {
    Button, Input, Form, Label
} from "reactstrap";

//Note: implement autocomplete feature later on

function SearchBar ({ searchData, filterData, changeErrorFlag, errorFlag, changeDoneFlag, params, done }) {
    
    const [data, setData] = useState('');

    //change params type to 'search' mode
    params.type = "search";
    //console.log(params);

    // Calling External API to get product data
    const getSuggestions = async (value) => {
        changeDoneFlag();
        //isLoading();
        params.search_term = `${data}`;
        if(filterData.sort_by){
            params = { ...params, sort_by: filterData.sort_by[0] }
        }
        if(filterData.customer_location){
            params = { ...params, customer_location: filterData.customer_location[0] }
        }
        //const inputValue = value.trim().toLowerCase();
        try{
            const response = await axios.get('https://api.rainforestapi.com/request', { params })
            const data = response.data.search_results;
            //console.log(data);
            searchData(data);
            if(errorFlag === true){
                changeErrorFlag();
            }
            changeDoneFlag();
        }catch(err){
            //isLoading();
            if(errorFlag !== true){
                changeErrorFlag();
            }
            changeDoneFlag();
            //error(err.message);
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