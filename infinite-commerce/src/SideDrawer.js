import './SideDrawer.css';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import CommerceAPI from "./api";
import {useSelector, useDispatch} from "react-redux";
import {selectUser, selectCart} from "./features/userSlice";
import { shoppingCartState, loginState } from "./features/userSlice";
import AlertDismissible from "./AlertDismissible";
import ReactLoading from 'react-loading';
import CartItem from "./CartItem";
import { Wrapper } from "./SideDrawer.styles.js";
import { useCallback } from 'react';

const SideDrawer = ({show, click, params, cartData, changeCartData}) => {
    const [errorFlag, setErrorFlag] = useState(false);
    const [done, setDone] = useState(true);
    const changeErrorFlag = () => {
        setErrorFlag(errorFlag => !errorFlag);
    }
    // const changeDoneFlag = () => {
    //     setDone(done => !done);
    // }
    //to get user info in redux store
    const userState = useSelector(selectUser);
    //to get user cart data
    const cartState = useSelector(selectCart);
    //in order to add a class for styling depending on whether it's toggled or not
    const sideDrawerClass = ["sidedrawer"];
    if(show){
        sideDrawerClass.push("show")
    }
    //to use the redux dispatch method
    const dispatch = useDispatch();
    //keep track of item count in cart
    const [itemCount, setItemCount] = useState(-1);
    const setCountToZero = () => {
        setItemCount(0)
    }
    const updateCartData = useCallback(()=> {
        async function updateCartData() {
            const username = userState.username;
            const user_id = userState.user_id;
            const token = userState.token;
            let cartDataRes;
            try{
                cartDataRes = await CommerceAPI.getAllItemsInShoppingCart(username, user_id, token);
            }catch(err){
                if(errorFlag !== true){
                    changeErrorFlag();
                }
                return cartDataRes;
            }
            //add data into redux store
            //save cart data in redux state
            dispatch(shoppingCartState(cartDataRes.items));
            changeCartData(cartDataRes.items);
            localStorage.setItem('user_cart', JSON.stringify(cartDataRes.items));
            return cartDataRes.items;
        }
        updateCartData();
    }, [changeCartData, dispatch, errorFlag, userState.token, userState.user_id, userState.username]);
    useEffect(() => {
        async function updateCart(){
            if(cartData === undefined){
                let cartDataItems;
                try{
                    cartDataItems = await updateCartData();
                    //console.log(cartDataItems);
                }catch(err){
                    if(errorFlag !== true){
                        changeErrorFlag();
                    }
                    return;
                }
                let itemCount = 0;
                for(let item of cartDataItems.items){
                    //console.log(parseInt(item.quantity));
                    itemCount = itemCount + parseInt(item.quantity);
                }
                //console.log(itemCount);
                setItemCount(itemCount);
                if(errorFlag === true){
                    changeErrorFlag();
                }
            }else{
                //const itemCount = cartState.items.length;
                let itemCount = 0;
                if(cartData.items !== undefined){
                    for(let item of cartData.items){
                        //console.log(parseInt(item.quantity));
                        itemCount = itemCount + parseInt(item.quantity);
                        changeCartData(cartData.items);
                    }
                }else{
                    for(let item of cartData){
                        //console.log(parseInt(item.quantity));
                        itemCount = itemCount + parseInt(item.quantity);
                    }
                }
                setItemCount(itemCount);
                if(errorFlag === true){
                    changeErrorFlag();
                }
            }
        }
        updateCart();
    },[cartData, errorFlag, updateCartData])

    async function checkoutItemCount() {
        //this returns (new shopping cart with items in it) {new_shopping_cart_id, items: [ {item_id, store_name, shopping_cart, asin }, ... ]}
        //implement a way to use this data in the shopping cart in the future.
        const token = userState.token;
        const newShoppingCart = await CommerceAPI.checkout(userState.username, userState.user_id, userState.token);
        dispatch(shoppingCartState(newShoppingCart));
        localStorage.setItem('user_cart', JSON.stringify(newShoppingCart));
        //add new shoppingcart ID to redux store
        const updatedUserData = await CommerceAPI.getUserInfo(userState.username, userState.token);
        const new_user_data = {
            username: updatedUserData.user.username,
            user_id: updatedUserData.user.user_id,
            first_name: updatedUserData.user.first_name,
            last_name: updatedUserData.user.last_name,
            is_admin: updatedUserData.user.is_admin, 
            shopping_cart_id: newShoppingCart.new_shopping_cart_id,
            email: updatedUserData.user.email,
            token: token,
            loggedIn: true,
        }
        dispatch(
            loginState(new_user_data)
        );
        //put user info into local storage
        localStorage.setItem('user_data', JSON.stringify(new_user_data));
        setCountToZero();
    }

    //Increment quantity for an item in cart
    async function addToCart(item){
        setDone(false);
        const username = userState.username;
        const user_id = userState.user_id;
        const store_name = item.store_name;
        const asin = item.asin;
        const token = userState.token;
        const quantity = parseInt(item.quantity) + 1;
        //Returns { [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]} (all items in current cart)
        let itemsInCart;
        try{
            itemsInCart = await CommerceAPI.updateQuantity(username, user_id, store_name, asin, quantity, token);
        }catch(err){
            console.log(err);
                if(errorFlag !== true){
                    changeErrorFlag();
                }
                setDone(true);
                return;
        }
        let addedDetailsItemsInCart = {};
        addedDetailsItemsInCart.new_shopping_cart_id = cartState.new_shopping_cart_id
        addedDetailsItemsInCart.items = itemsInCart;
        //add data into redux store
        //save cart data in redux state
        dispatch(
            shoppingCartState(addedDetailsItemsInCart.items)
        )
        changeCartData(addedDetailsItemsInCart.items);
        if(errorFlag === true){
            changeErrorFlag();
        }
        setDone(true);
    }

    //decrement quantity for an item in cart
    async function removeFromCart(item){
        setDone(false);
        const username = userState.username;
        const user_id = userState.user_id;
        const store_name = item.store_name;
        const asin = item.asin;
        const token = userState.token;
        let quantity;
        let addedDetailsItemsInCart = {};
        if(parseInt(item.quantity) === 1){
            try{
                await CommerceAPI.deleteItem(username, user_id, store_name, asin, token);
                const itemsInCart = await CommerceAPI.getAllItemsInShoppingCart(username, user_id, token);
                addedDetailsItemsInCart = itemsInCart;
            }catch(err){
                console.log(err);
                if(errorFlag !== true){
                    changeErrorFlag();
                }
                setDone(true);
                return;
            }
        }else{
            quantity = parseInt(item.quantity) - 1;
            let itemsInCart;
            //Returns { [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]} (all items in current cart)
            try{
                itemsInCart = await CommerceAPI.updateQuantity(username, user_id, store_name, asin, quantity, token);
            }catch(err){
                console.log(err);
                if(errorFlag !== true){
                    changeErrorFlag();
                }
                setDone(true);
                return;
            }
            addedDetailsItemsInCart.new_shopping_cart_id = cartState.new_shopping_cart_id
            addedDetailsItemsInCart.items = itemsInCart;
        }
        //add data into redux store
        //save cart data in redux state
        dispatch(
            shoppingCartState(addedDetailsItemsInCart)
        )
        changeCartData(addedDetailsItemsInCart.items);
        if(errorFlag === true){
            changeErrorFlag();
        }
        setDone(true);
    }
    
    function calculateTotal(cartData){
        console.log(cartData);
        if(cartData !== undefined && cartData.length > 0){
            let total = cartData.reduce((acc, item) => acc + item.total, 0)
            return total;
        }
        return 0.00;
    }
    
    return (
        show && <div className={sideDrawerClass.join(" ")}>
            <ul className="sidedrawer__links" onClick={click}>
                <li>
                    <Link to="/products">
                        <i className="fas fa-shopping-cart"></i>
                        <span>
                            Your Cart <span className="sidedrawer__cartbadge">{itemCount}</span> 
                        </span>
                    </Link>
                </li>
                <li>
                   <Link to="/products">Shop</Link> 
                </li>
            </ul>
            {cartState.items.length === 0 ? <p className="no-item">No items in cart.</p> : null}
            { done === false ? <li id="spinner"> <ReactLoading type={"bubbles"} color={"#72bcd4"} height={400} width={200} /> </li> : 
            <>
            <Wrapper>
                {(cartData != null) ? cartData.map((item) => (
                    <CartItem 
                        key={item.asin}
                        item={item}
                        addToCart={async () => {await addToCart(item)}}
                        removeFromCart={async () => {await removeFromCart(item)}}
                    />
                )) : <div></div>}
            </Wrapper>
            <h3 className="total">Total: ${calculateTotal(cartData)}</h3>
            </>
            }
            { errorFlag === true && <li><AlertDismissible msg={"Error retrieving cart items"}/></li>}
            <li>
                <button className="checkout__button" variant="primary" onClick={() => {checkoutItemCount()}}>Checkout</button>
            </li>
        </div>
    );
}

export default SideDrawer
