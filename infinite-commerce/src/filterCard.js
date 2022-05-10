import "./filterCard.css"
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectUser} from "./features/userSlice";
import CommerceAPI from "./api";
import { shoppingCartState } from "./features/userSlice";
import axios from 'axios';

function FilterCard({ suggestion, cartData, changeCartData, params }){
//implement what happens when item is added to shopping cart

//to get user info in redux store
const userState = useSelector(selectUser);
//to use the redux dispatch method
const dispatch = useDispatch();
const [errorFlag, setErrorFlag] = useState(false);
    const [done, setDone] = useState(true);
    const changeErrorFlag = () => {
        setErrorFlag(errorFlag => !errorFlag);
    }

async function addToCart(evt, suggestion){
    evt.preventDefault();
    setDone(false);
    //send product info to shopping cart
    //Returns { shopping_cart_id, items: [ {item_id, store_name, shopping_cart_id, asin }, ... ]} (all items in current cart)
    const itemsInCart = await CommerceAPI.addItemToShoppingCart(userState.username, userState.user_id, 'Amazon', suggestion.asin, userState.token);
    //change params type "product" mode
    params.type = "product";
    //to get item quantity
    let quantity = 0;
    for(let item of itemsInCart.items){
        if(item.asin === suggestion.asin){
            quantity = parseInt(item.quantity);
        }
    }
    //get cart items' names, prices, images
    //updatedCartData includes each cart item's name, price, image i.e. [{asin, title,image,price,total},...]
    let itemASIN = suggestion.asin;
    params.asin = itemASIN;
    try{
        //console.log(JSON.stringify(params));
        const response = await axios.get('https://api.rainforestapi.com/request', { params });
        const data = await response.data.product;
        console.log(data);
        const title = data.title;
        let price = 0.00;
        if(data.buybox_winner.price.value){
            price = parseInt(data.buybox_winner.price.value);
        }else{
            price = 0.00;
        }
        let image = "";
        if(data.images){
            image = data.images[0].link;
        }
        let total = price * quantity;
        for(let item of itemsInCart.items){
            if(item.asin === itemASIN){
                item.title = title;
                item.price = price;
                item.total = total;
                item.image = image;
                item.quantity = quantity;
            }
        }
        //put user cart into local storage
        localStorage.setItem('user_cart', JSON.stringify(itemsInCart));
    }catch(err){
        if(errorFlag !== true){
            changeErrorFlag();
        }
        setDone(true);
        return;
    }
    //add data into redux store
    //save cart data in redux state
    dispatch(
        shoppingCartState(itemsInCart)
    )
    changeCartData(itemsInCart);
}

    return (
        <>
            <div className = "product">
                <img className="img-top card-img-top" src={suggestion.image} alt="product-card"></img>

                <div className="product__info">
                    <p className="info__name">{suggestion.title}</p>
                    <p className="info__description"></p> 
                    {/* add description later */}
                    <p className="info__price">Price: {(suggestion.prices) ? suggestion.prices[0].raw : "Unknown"}</p>
                    
                    <a className="info__button" variant="primary" href={suggestion.link}>Go to Amazon Link</a>
                    <br />
                    {/* add link to item page later */}
                    <button className="add__button" variant="primary" onClick={(evt)=> {addToCart(evt, suggestion);}}>Add To Cart</button>
                </div>
            </div>    
        </>
        )
}

export default FilterCard;