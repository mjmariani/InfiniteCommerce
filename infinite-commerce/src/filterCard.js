import "./filterCard.css"
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FilterCard({ suggestion, key, handleAdd, setItemIDDescription, renderDescriptionPage }){
//implement what happens when item is added to shopping cart


    return (
        <>
            <div className="col-3">
                <div className="card mb-1">
                <img className="img-top" src={suggestion.image} className="card-img-top" alt="product-card"></img>
                
                <div className="card-body">
                <Link className="description-link" to="/description" onClick={(evt)=> {evt.preventDefault(); renderDescriptionPage(suggestion.asin)}} ><h5 className="card-title">{suggestion.title}</h5></Link>
                <p className="card-text"></p>
                </div>
                <div className="card-footer col-12">
                <Button variant="primary" onClick={(evt)=> {evt.preventDefault(); renderDescriptionPage(suggestion.asin)}} >See Description</Button>
                <Button className="amazon-link" variant="primary" href={suggestion.link}>Go to Amazon Link</Button>
                <Button onClick={ () => {handleAdd("Amazon", suggestion.asin)} } variant="primary" >Add to Shopping Cart</Button>
                </div>
                </div>
                </div>
        </>

        )
}

export default FilterCard;