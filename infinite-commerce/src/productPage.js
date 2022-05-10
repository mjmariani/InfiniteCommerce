import "./productPage.css";
import React, { useState, useEffect } from "react";
//import InfiniteScroll from 'react-infinite-scroll-component';
import Filter from "./filter";
import SearchBar from "./searchBar";
import FilterCard from "./filterCard"
import AlertDismissible from "./AlertDismissible";
import ReactLoading from 'react-loading';
//implement next page feature
//implement infinite scroll

function ProductPage({params, cartData, changeCartData, cartDone, setCartDone}){
    const [data, setData] = useState('');
    let [filterData, setFilterData] = useState({
        'sort_by': '',
        'customer_location': '',
    });
    useEffect(()=>{},[filterData, data]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [done, setDone] = useState(true);

    const changeErrorFlag = () => {
        setErrorFlag(errorFlag => !errorFlag);
    }

    const changeDoneFlag = () => {
        setDone(done => !done);
    }


    const changeFilterData = (filter, value) => {
        setFilterData(filterData => ({ ...filterData, [filter]: [value]}));
        //console.log(filterData);
    }

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
    //             "price": $##.## 
    //             } }

    return (
    <>
                        { errorFlag === true && <div id="errorMsg"><AlertDismissible msg={"Search Error"}/></div>}
                        <div className="search-bar">
                            <SearchBar searchData={
                                (data) => setData(data)
                            } filterData={filterData} changeErrorFlag={()=>changeErrorFlag()} errorFlag={errorFlag} changeDoneFlag={()=>changeDoneFlag() } done={done} params={params} />
                        </div>
                        <div className="row">
                        <div className="col-2">
                            <Filter filterData={(filter, value) => changeFilterData(filter, value)} />
                        </div>
                        <div className="col">
                        <div className="row">
                        { done === false && <div id="spinner"> <ReactLoading type={"bubbles"} color={"#72bcd4"} height={500} width={300} /> </div>}
                            {done === true && <div className="product__screen">
                                {(data) ? data.map((result, index) => {
                            //  console.log(result);
                                    return ( 
                                    <FilterCard suggestion={ result } key={index} changeCartData={(data) => changeCartData(data)} cartData={cartData} params={params} cartDone={cartDone} setCartDone={setCartDone}/>
                                    )
                        }): <p></p>}
                            </div>}
                        </div>
                        </div>
            </div>
    </>
    )
}

export default ProductPage;