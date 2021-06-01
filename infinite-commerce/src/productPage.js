import "./productPage.css";
import SearchBar from "./searchBar";
import FilterCard from "./filterCard"
import React, { useState, useEffect, useContext, useCallback } from "react";

function ProductPage(){

    let searchData = [];

    return ( 
        <>
            <div className="search-bar">
                <SearchBar searchData={ {
                    searchData
                } } />
            </div>
            {searchData.map(result => {
                return <FilterCard suggestion={ result } />
            })}
        </>
    )

}

export default ProductPage;