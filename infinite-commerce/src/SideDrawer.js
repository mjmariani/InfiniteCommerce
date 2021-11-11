import './SideDrawer.css';
import { Link } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import CommerceAPI from "./api";
import {useSelector, useDispatch} from "react-redux";
import {selectUser, selectCart} from "./features/userSlice";
import { shoppingCartState, loginState } from "./features/userSlice";

const SideDrawer = ({show, click, refreshCart, setRefreshCart}) => {
    //to get user info in redux store
    const userState = useSelector(selectUser);

    //in order to add a class for styling depending on whether it's toggled or not
    const sideDrawerClass = ["sidedrawer"];

    if(show){
        sideDrawerClass.push("show")
    }

    //to use the redux dispatch method
    const dispatch = useDispatch();

    //update cart data
    async function updateCartData() {
        const username = userState.username;
        const user_id = userState.user_id;
        const token = userState.token;
        const cartDataRes = await CommerceAPI.getAllItemsInShoppingCart(username, user_id, token);
            //add data into redux store
            //save cart data in redux state
            dispatch(shoppingCartState(cartDataRes))
            return cartDataRes;
    }


    const [cartData, setCartData] = useState([]);

    const setShoppingCartData = (data) => {
        setCartData(data)
    }

    //keep track of item count in cart
    const [itemCount, setItemCount] = useState(-1);

    const incrementCount = () => {
        setItemCount(itemCount + 1)
    }

    const setCountToZero = () => {
        setItemCount(0)
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
            const cartDataDB = updateCartData();

            //fetch data from redux store
            setShoppingCartData(cartDataDB);
            incrementCount();
            setRefreshCart();
    }}, [refreshCart]);

    async function checkoutItemCount() {
        setCountToZero();
        //this returns (new shopping cart with items in it) {new_shopping_cart_id, items: [ {item_id, store_name, shopping_cart, asin }, ... ]}
        //implement a way to use this data in the shopping cart in the future.
        
        const newShoppingCart = await CommerceAPI.checkout(userState.username, userState.user_id, userState.token);
        const newShoppingCartID = newShoppingCart.new_shopping_cart_id;
        
        //add new shoppingcart ID to redux store
        const updatedUserData = await CommerceAPI.getUserInfo(userState.username, userState.token);
        const token = selectUser.token;

        dispatch(
            loginState({
            username: updatedUserData.username,
            user_id: updatedUserData.user_id,
            first_name: updatedUserData.firstname,
            last_name: updatedUserData.lastname,
            is_admin: updatedUserData.isadmin, 
            shopping_cart_id: updatedUserData.shopping_cart_id,
            email: updatedUserData.email,
            token: token,
            loggedIn: true,
        })
        );
        //setCountToZero();
    }
    

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
                <a className="checkout__button" variant="primary" onClick={() => {checkoutItemCount()}}>Checkout</a>
            </li>
            
            
        </div>
    );
}

export default SideDrawer
