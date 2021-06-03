import "./description.css";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

function Description ({item, handleAdd}){

    

      return ( 
        <>
            <div className="item">
                <div className="col-sm-8">
                    <img src={`${item.product.main_image.link}`}/>
                    <div>
                        <Button variant="primary" onClick= {handleAdd("Amazon", item.product.asin)}>Add to Shopping Cart</Button>
                    </div>
                </div>
                <div className="col-sm">
                    <div>
                        {item.product.description}
                    </div>
                    <div>
                        <h2>Rating: {item.product.rating}</h2>
                        <h2>Five Star Ratings Percentage: {item.product.rating_breakdown.five_star.percentage}</h2>
                        <h2>Four Star Ratings Percentage: {item.product.rating_breakdown.four_star.percentage}</h2>
                        <h2>Three Star Ratings Percentage: {item.product.rating_breakdown.three_star.percentage}</h2>
                        <h2>Two Star Ratings Percentage: {item.product.rating_breakdown.two_star.percentage}</h2>
                        <h2>One Star Ratings Percentage: {item.product.rating_breakdown.one_star.percentage}</h2>
                    </div>
                </div>
            </div>

        </>
    )
  
    

    
}

export default Description;