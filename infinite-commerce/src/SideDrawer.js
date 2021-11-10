import './SideDrawer.css';
import { Link } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import CommerceAPI from "./api";
import {useSelector, useDispatch} from "react-redux";
import {selectUser, selectCart} from "./features/userSlice";
import { shoppingCartState } from "./features/userSlice";

const SideDrawer = ({show, click, refreshCart, setRefreshCart}) => {
    //to get user info in redux store
    const userState = useSelector(selectUser)

    //in order to add a class for styling depending on whether it's toggled or not
    const sideDrawerClass = ["sidedrawer"];

    if(show){
        sideDrawerClass.push("show")
    }

    //to use the redux dispatch method
    const dispatch = useDispatch();

    //update cart data
    async function updateCartData() {
        const cartDataRes = await CommerceAPI.getAllItemsInShoppingCart(userState.username, userState.user_id, userState.token);
            //add data into redux store
            //save cart data in redux state
            dispatch(shoppingCartState(cartDataRes))
            return cartDataRes;
    }


    const [cartData, setCartData] = useState([]);

    const setShoppingCartData = () => {
        setCartData()
    }

    //keep track of item count in cart
    const [itemCount, setItemCount] = useState(0);

    const incrementCount = () => {
        setItemCount(itemCount + 1)
    }

    //useEffect hook to be called only once to count number of items in cart after log in first time
    // useEffect(() => {
    //     let count = 0;
    //     const cartData = updateCartData();
    //     if(cartData){
    //         cartData.map(() => {
    //             count++;
    //         })
    //     }
    //     setItemCount(count);
    // }, []);

    //for everytime the refreshcart flag is turned to true (means everytime an item is added)
    useEffect(() => {
        if(!refreshCart){
            //fetch data from redux store
            setShoppingCartData(selectCart);
            incrementCount();
            setRefreshCart();
    }}, [refreshCart]);
    

    return (
        show && <div className={sideDrawerClass.join(" ")}>
            <ul className="sidedrawer__links" onClick={click}>
                <li>
                    <Link>
                        <i className="fas fa-shopping-cart"></i>
                        <span>
                            Cart <span className="sidedrawer__cartbadge">{itemCount}</span> 
                        </span>
                    </Link>
                </li>
                <li>
                   <Link to="/products">Shop</Link> 
                </li>
            </ul>
            <li>
                {/* {cartData.map((item)=>{
                    //add item imgs and title in their own box
                })} */}
            </li>
            <li>
                <a className="checkout__button" variant="primary">Checkout</a>
            </li>
            
            
        </div>
    );
}

export default SideDrawer
