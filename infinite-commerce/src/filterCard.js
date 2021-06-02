import "./filterCard.css"
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FilterCard({ suggestion, key }){
//implement what happens when item is added to shopping cart

    return (
        <>

            
            <div className="col-3">
                <div className="card mb-1">
                <img className="img-top" src={suggestion.image} className="card-img-top" alt="product-card"></img>
                
                <div className="card-body">
                <Link className="description-link" to="/description"><h5 className="card-title">{suggestion.title}</h5></Link>
                <p className="card-text">{suggestion.title}</p>
                </div>
                <div className="card-footer col-12">
                <Link className="description-link" to="/description"><Button variant="primary" >See Description</Button></Link>
                <Button className="amazon-link" variant="primary" href={suggestion.link}>Go to Amazon Link</Button>
                <Link className="shopping-link" onClick=""><Button variant="primary" >Add to Shopping Cart</Button></Link>
                </div>
                </div>
                </div>
                
        </>

        )
}

export default FilterCard;