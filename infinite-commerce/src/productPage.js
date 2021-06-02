import "./productPage.css";
import SearchBar from "./searchBar";
import FilterCard from "./filterCard"
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import Filter from "./filter";
import InfiniteScroll from 'react-infinite-scroll-component';

//implement next page feature
//implement infinite scroll


function ProductPage(){

    let [data, setData] = useState('');
    // let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");
    let [filterData, setFilterData] = useState({
        'sort_by': '',
        'customer_location': '',
    });

    

    //console.log(loading)

    // const isLoading = useCallback(() => {
    //     setLoading(!loading);
    // }, data)

    // const isLoading = () => setLoading(!loading);


    // if(loading){
    //     //console.log("loading")
    //     return (<h1>Loading...</h1>) 
    // }else if(error){
    //     <>
    //         <div class="alert alert-danger">
    //             <strong>{error.message}</strong> 
    //         </div>
    //         <div className="search-bar">
    //         <SearchBar searchData={
    //             (data) => setData(data)
    //         } isLoading = {isLoading} error={(msg)=>setError(msg)}/>
    //         </div>
    //     </>}else{
    //             //console.log("not loading")
    //         return ( 
    //             <>
    //                 <div className="search-bar">
    //                     <SearchBar searchData={
    //                         (data) => setData(data)
    //                     } isLoading = {isLoading} error={(msg)=>setError(msg)}/>
    //                 </div>
    //                 {(data) ? data.map(result => {
    //                     console.log(result);
    //                     return <FilterCard suggestion={ result } />
    //                 }): <p></p>}
    //             </>
    //         )
    //             }


    return ( 
                    <>
                        <div className="search-bar">
                            <SearchBar searchData={
                                (data) => setData(data)
                            } error={(msg)=>setError(msg)} filterData={filterData}/>
                        </div>
                        <div className="row">
                        <div class="col-2">
                            <Filter filterData={(filter, value) => setFilterData(filterData => ({ ...filterData, [filter]: [value]}))}/>
                        </div>
                        <div className="col">
                            <div className="row">
                                {/* {(data) ? <InfiniteScroll
                                        dataLength={data.length} //This is important field to render the next data
                                        next={(nextPage)=> (!nextPage)}
                                        hasMore={true}
                                        loader={<h4>Loading...</h4>}
                                        endMessage={
                                            <p style={{ textAlign: 'center' }}>
                                            <b>Yay! You have seen it all</b>
                                            </p>
                                        }
                                        // below props only if you need pull down functionality
                                        //refreshFunction={this.refresh}
                                        pullDownToRefresh
                                        pullDownToRefreshThreshold={40}
                                        pullDownToRefreshContent={
                                            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                                        }
                                        releaseToRefreshContent={
                                            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                                        }
                                        >
                        {data.map((result, index) => {
                            console.log(result);
                                    return ( 
                                        
                                    <FilterCard suggestion={ result } key={index}/>
                                    
                                    )
                            
                        })}
                        </InfiniteScroll>: <p></p>} */}
                        {(data) ? data.map((result, index) => {
                            console.log(result);
                                    return ( 
                                        
                                    <FilterCard suggestion={ result } key={index} />
                                    
                                    )
                            
                        }): <p></p>}
                            
                        
                        </div>
                        </div>
                        </div>
                        
                        
                    </>
                )


}

export default ProductPage;