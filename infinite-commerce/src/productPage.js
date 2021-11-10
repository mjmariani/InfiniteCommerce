import "./productPage.css";
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
//import InfiniteScroll from 'react-infinite-scroll-component';
import Filter from "./filter";
import SearchBar from "./searchBar";
import FilterCard from "./filterCard"
//implement next page feature
//implement infinite scroll

function ProductPage({refreshCart}){
    let [data, setData] = useState('');
    // let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");
    let [filterData, setFilterData] = useState({
        'sort_by': '',
        'customer_location': '',
    });

    // data = { {
    //             "position":1
    //             "title":"Convenient Operation 8pcs Anti Curling Carpet Tape Anti Slip Corners Edges Gripper Pads Kitchen Bathroom Blanket Non-Slip Sticker Reusable Grip Strong Gel (Color : B)"
    //             "asin":"B093GWTZSM"
    //             "link":"https://www.amazon.com/dp/B093GWTZSM"
    //             "categories":[...]
    //             "image":"https://m.media-amazon.com/images/I/41PRHKl2KiS._AC_UL320_.jpg"
    //             "is_prime":false
    //             "is_amazon_fresh":false
    //             "is_whole_foods_market":false
    //             "sponsored":false
    //             } }

    return (
    <>
                        <div className="search-bar">
                            <SearchBar searchData={
                                (data) => setData(data)
                            } error={(msg)=>setError(msg)} filterData={filterData}/>
                        </div>

                        <div className="row">
                        <div class="col-2">
                            <Filter filterData={(filter, value) => setFilterData(filterData => ({ ...filterData, [filter]: [value]}))} />
                        </div>

                        <div className="col">
                        <div className="row">
                            <div className="product__screen">
                                {(data) ? data.map((result, index) => {
                            console.log(result);
                                    return ( 
                                        
                                    <FilterCard suggestion={ result } key={index} refreshCart={refreshCart}/>
                                    
                                    )
                            
                        }): <p></p>}
                        
                            </div>
                        
                            
                        
                        </div>
                        </div>
            </div>
    </>
    )
}

export default ProductPage;