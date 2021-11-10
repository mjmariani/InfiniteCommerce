import "./filterCard.css"
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import {selectUser} from "./features/userSlice";
import CommerceAPI from "./api";
import { shoppingCartState } from "./features/userSlice";

function FilterCard({ suggestion, key, refreshCart}){
//implement what happens when item is added to shopping cart

//to get user info in redux store
const userState = useSelector(selectUser);

//to use the redux dispatch method
const dispatch = useDispatch();

async function addToCart(evt, suggestion){
    evt.preventDefault();

    //send product info to shopping cart
    //Returns { [ {item_id, store_name, shopping_cart_id, asin }, ... ]} (all items in current cart)
    const itemsInCart = CommerceAPI.addItemToShoppingCart(userState.username, userState.user_id, 'Amazon', suggestion.asin, userState.token)

    //add data into redux store
    //save cart data in redux state
    dispatch(
        shoppingCartState(itemsInCart)
    )

    //update reload variable to refresh cart data
    refreshCart();

}

    return (
        <>
            {/* <div className="col-3">
                <div className="card mb-1">
                <img className="img-top" src={suggestion.image} className="card-img-top" alt="product-card"></img>
                
                <div className="card-body">
                <Link className="description-link" to="/description" onClick={(evt)=> {evt.preventDefault()}} ><h5 className="card-title">{suggestion.title}</h5></Link>
                <p className="card-text"></p>
                </div>
                <div className="card-footer col-12">
                <Button variant="primary" onClick={(evt)=> {evt.preventDefault(); }} >See Description</Button>
                <Button className="amazon-link" variant="primary" href={suggestion.link}>Go to Amazon Link</Button>
                {/* <Button onClick={ () => {handleAdd("Amazon", suggestion.asin)} } variant="primary" >Add to Shopping Cart</Button> */}
                {/* </div> */}
                {/* </div> */}
                {/* </div> */}

            <div className = "product">
                <img className="img-top" src={suggestion.image} className="card-img-top" alt="product-card"></img>

                <div className="product__info">
                    <p className="info__name">{suggestion.title}</p>
                    <p className="info__description"></p> 
                    {/* add description later */}
                    <p className="info__price"></p>
                    {/* add price */}
                    <a className="info__button" variant="primary" href={suggestion.link}>Go to Amazon Link</a>
                    <br />
                    <a className="add__button" variant="primary" onClick={(evt)=> {addToCart(evt, suggestion);}}>Add To Cart</a>
                </div>
            </div>    
        </>

        )
}

export default FilterCard;